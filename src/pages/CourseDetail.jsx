import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator"; // Cần component này hoặc dùng <hr />
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  FileText,
  Upload,
  Edit,
  AlertTriangle,
  Lock,
  BookOpen,
  Send,
  Download,
  GraduationCap,
  ChevronRight,
  Info,
  MoreHorizontal,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  X,
  Activity,
  Plus,
  TrendingUp,
  BarChart,
  Star,
  
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import axiosClient from "../api/axiosClient";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// --- Mock Data ---
const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    title: "Bài tập Tuần 1",
    deadline: "2025-02-20",
    status: "submitted",
    score: 8.5,
  },
  {
    id: 2,
    title: "Bài tập Tuần 2",
    deadline: "2025-02-27",
    status: "pending",
    score: null,
  },
];

const fetchCourseDetail = async (id) => {
  const res = await axiosClient.get(`/courses/${id}`);
  return res.data || res;
};

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Mutation: Tutor đánh dấu hoàn thành
  const completeSessionMutation = useMutation({
    mutationFn: async (sessionId) => {
      return axiosClient.put(`/courses/sessions/${sessionId}/complete`);
    },
    onSuccess: () => {
      toast.success("Đã kết thúc buổi học!");
      queryClient.invalidateQueries(["course", id]); // Load lại để cập nhật trạng thái
    },
    onError: () => toast.error("Lỗi thao tác"),
  });
  const userRole = localStorage.getItem("role") || "student";
  const userId = localStorage.getItem("userId");
  const isTutor = userRole === "tutor";
  const [reportDialogState, setReportDialogState] = useState({
    isOpen: false,
    student: null,
    reports: [], // Mock data hoặc fetch từ API
  });
  const fetchStudentReports = async (courseId, studentId) => {
    // console.log để kiểm tra xem Frontend nhận được gì
    const res = await axiosClient.get(`/courses/${courseId}/reports`, {
      params: { studentId },
    });
    return res.data || res || [];
  };
  const [selectedReport, setSelectedReport] = useState(null); // Lưu report đang xem
  const [isEditing, setIsEditing] = useState(false); // Chế độ sửa
  const [editFormData, setEditFormData] = useState({}); // Dữ liệu form sửa
  const [feedbackSession, setFeedbackSession] = useState(null); // Session đang được đánh giá
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: "" });

  // Mutation gửi đánh giá
  const feedbackMutation = useMutation({
    mutationFn: async () => {
      return axiosClient.post(
        `/courses/sessions/${feedbackSession.id}/feedback`,
        feedbackData
      );
    },
    onSuccess: () => {
      toast.success("Cảm ơn bạn đã đánh giá!");
      setFeedbackSession(null); // Đóng dialog
      // Có thể invalidate query để cập nhật trạng thái nếu cần
    },
    onError: () => toast.error("Lỗi gửi đánh giá"),
  });
  // Khi bấm "Xem chi tiết", lưu data vào state
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setEditFormData({
      topics: report.topicsCovered?.join(", ") || "",
      comprehension: report.comprehensionLevel,
      notes: report.progressNotes,
      strengths: report.strengths?.join(", ") || "",
      improvements: report.areasForImprovement?.join(", ") || "",
    });
    setIsEditing(false); // Mặc định là chế độ xem
  };
  const [sessionToComplete, setSessionToComplete] = useState(null);
  // MUTATION: Sửa
  const updateReportMutation = useMutation({
    mutationFn: async () => {
      return axiosClient.put(`/courses/reports/${selectedReport.id}`, {
        topicsCovered: editFormData.topics
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        comprehensionLevel: editFormData.comprehension,
        progressNotes: editFormData.notes,
        strengths: editFormData.strengths
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        areasForImprovement: editFormData.improvements
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      });
    },
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
      setIsEditing(false);
      setSelectedReport(null); // Đóng dialog (hoặc giữ lại và cập nhật data hiển thị)
      queryClient.invalidateQueries({ queryKey: ["student-reports"] });
    },
    onError: () => toast.error("Lỗi cập nhật"),
  });

  // MUTATION: Xóa
  const deleteReportMutation = useMutation({
    mutationFn: async () => {
      return axiosClient.delete(`/courses/reports/${selectedReport.id}`);
    },
    onSuccess: () => {
      toast.success("Đã xóa biên bản!");
      setSelectedReport(null); // Đóng dialog
      queryClient.invalidateQueries({ queryKey: ["student-reports"] });
    },
    onError: () => toast.error("Lỗi xóa biên bản"),
  });
  const [rescheduleData, setRescheduleData] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    date: "",
    time: "",
    reason: "",
    title: "", // <--- THÊM DÒNG NÀY
  });
  const { data: assignments = [] } = useQuery({
    queryKey: ["assignments", id],
    queryFn: async () => {
      const res = await axiosClient.get(`/courses/${id}/assignments`);
      return res.data || res || [];
    },
  });

  // 2. State quản lý Dialog
  const [selectedAssignment, setSelectedAssignment] = useState(null); // Bài tập đang chọn
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false); // Dialog nộp bài (Student)
  const [isGradingOpen, setIsGradingOpen] = useState(false); // Dialog chấm bài (Tutor)
  const [submissionFile, setSubmissionFile] = useState(""); // Link file nộp

  // 3. Mutation Tạo Bài Tập (Tutor)
  const createAssignmentMutation = useMutation({
    mutationFn: (data) => axiosClient.post(`/courses/${id}/assignments`, data),
    onSuccess: () => {
      toast.success("Đã tạo bài tập");
      queryClient.invalidateQueries(["assignments"]);
      setIsCreateReportOpen(false); // Tận dụng lại state hoặc tạo state mới
    },
  });

  // 4. Mutation Nộp Bài (Student)
  const submitAssignmentMutation = useMutation({
    mutationFn: () =>
      axiosClient.post(`/assignments/${selectedAssignment.id}/submit`, {
        file_url: submissionFile,
        content: "Nộp qua link",
      }),
    onSuccess: () => {
      toast.success("Nộp bài thành công!");
      setIsSubmissionOpen(false);
      queryClient.invalidateQueries(["assignments"]);
    },
  });

  // 5. Mutation Chấm Điểm (Tutor)
  const gradeMutation = useMutation({
    mutationFn: ({ submissionId, score, feedback }) =>
      axiosClient.put(`/assignments/submissions/${submissionId}/grade`, {
        score,
        feedback,
      }),
    onSuccess: () => {
      toast.success("Đã lưu điểm số");
      queryClient.invalidateQueries(["assignments"]);
    },
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourseDetail(id),
    retry: 1,
  });
  const [reportDialogStudent, setReportDialogStudent] = useState(null);

  // Query: Tự động fetch báo cáo khi reportDialogStudent có dữ liệu
  const { data: studentReports = [], isLoading: isLoadingReports } = useQuery({
    queryKey: ["student-reports", id, reportDialogStudent?.id],
    queryFn: () => fetchStudentReports(id, reportDialogStudent?.id),
    enabled: !!reportDialogStudent, // Chỉ chạy khi đã chọn sinh viên
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });

  // Helper: Tính toán thống kê nhanh từ dữ liệu API
  const reportStats = React.useMemo(() => {
    if (!studentReports.length)
      return { count: 0, avgScore: "N/A", comprehension: 0 };

    const count = studentReports.length;

    // Giả sử API trả về comprehensionLevel dạng: 'excellent' (100), 'good' (80), 'fair' (60), 'poor' (40)
    const scoreMap = { excellent: 100, good: 80, fair: 60, poor: 40 };
    const totalScore = studentReports.reduce(
      (acc, curr) => acc + (scoreMap[curr.comprehensionLevel] || 0),
      0
    );
    const avg = Math.round(totalScore / count);

    return {
      count,
      comprehension: avg,
      lastDate: studentReports[studentReports.length - 1]?.sessionDate,
    };
  }, [studentReports]);
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    topics: "", // Nhập chuỗi cách nhau dấu phẩy
    comprehension: "good",
    notes: "",
    strengths: "",
    improvements: "", // <--- THÊM MỚI
  });

  // Mutation: Gửi dữ liệu tạo báo cáo lên Server
  const createReportMutation = useMutation({
    mutationFn: async (data) => {
      // KIỂM TRA LOG: Xem ID có tồn tại trước khi gửi không
      console.log("Đang tạo biên bản cho Student ID:", reportDialogStudent?.id);

      if (!reportDialogStudent?.id) {
        throw new Error("Không tìm thấy ID sinh viên!");
      }

      return axiosClient.post(`/courses/${id}/reports`, {
        studentId: reportDialogStudent.id, // Đảm bảo ID này tồn tại
        topicsCovered: data.topics
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        comprehensionLevel: data.comprehension,
        progressNotes: data.notes,
        strengths: data.strengths
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        areasForImprovement: data.improvements
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      });
    },
    onSuccess: () => {
      toast.success("Đã lưu biên bản thành công!");
      setIsCreateReportOpen(false);
      setNewReport({
        topics: "",
        comprehension: "good",
        notes: "",
        strengths: "",
        improvements: "",
      });

      // 👇 CẬP NHẬT LẠI KEY INVALIDATE (Thêm String() để tránh lỗi kiểu số/chuỗi)
      queryClient.invalidateQueries({ queryKey: ["student-reports"] });
      // Hoặc dùng lệnh này để reload toàn bộ báo cáo của lớp đó cho chắc chắn
      // queryClient.invalidateQueries({ queryKey: ["student-reports"] });
    },
    onError: (err) => {
      console.error("Lỗi API:", err);
      toast.error("Lỗi: " + (err.message || "Không thể tạo biên bản"));
    },
  });
  const approveMutation = useMutation({
    mutationFn: async ({ studentId, action }) =>
      axiosClient.post(`/courses/${id}/approve`, { studentId, action }),
    onSuccess: (_, vars) => {
      toast.success(vars.action === "approve" ? "Đã duyệt" : "Đã từ chối");
      queryClient.invalidateQueries(["course", id]);
      setSelectedStudent(null);
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: async () =>
      axiosClient.put(
        `/courses/sessions/${rescheduleData.id}/reschedule`,
        newSchedule
      ),
    onSuccess: () => {
      toast.success("Đã dời lịch");
      setRescheduleData(null);
      queryClient.invalidateQueries(["course", id]);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async () => axiosClient.post(`/courses/${id}/register`),
    onSuccess: () => {
      toast.success("Đã gửi yêu cầu đăng ký");
      queryClient.invalidateQueries(["course", id]);
    },
  });

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (isError || !course)
    return (
      <div className="p-10 text-center text-red-500">Lỗi tải dữ liệu.</div>
    );

  const myEnrollment = course?.students?.find(
    (s) => String(s.id) === String(userId)
  );
  const isPending = myEnrollment?.status === "pending";
  const isActive = myEnrollment?.status === "active";
  const canAccessContent = isTutor || isActive;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* --- HEADER: Tiêu đề & Breadcrumb --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span
              className="cursor-pointer hover:text-[#3961c5]"
              onClick={() => navigate("/tutor/groups")}
            >
              Lớp học
            </span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">
              {course.title}
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  {course.subject}
                </Badge>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" /> {course.duration}{" "}
                  phút/buổi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-7xl mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- CỘT TRÁI: NỘI DUNG CHÍNH (66%) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Khu vực Tabs */}
            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                {["schedule", "materials", "assignments", "students"].map(
                  (tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#3961c5] data-[state=active]:text-[#3961c5] py-3 px-1 text-base font-medium text-gray-500 hover:text-gray-800"
                    >
                      {tab === "schedule" && "Lịch trình"}
                      {tab === "materials" && "Tài liệu"}
                      {tab === "assignments" && "Bài tập"}
                      {tab === "students" && "Thành viên"}
                      {tab === "students" &&
                        isTutor &&
                        course.students?.some(
                          (s) => s.status === "pending"
                        ) && (
                          <span className="ml-2 w-2 h-2 rounded-full bg-red-500 block"></span>
                        )}
                    </TabsTrigger>
                  )
                )}
              </TabsList>

              <div className="mt-6">
                {!canAccessContent ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Nội dung bị khóa
                    </h3>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                      {isPending
                        ? "Yêu cầu của bạn đang chờ giảng viên phê duyệt."
                        : "Vui lòng đăng ký tham gia lớp học để xem nội dung chi tiết."}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* TAB: SCHEDULE */}
                    <TabsContent value="schedule" className="space-y-4">
                      {course.sessions?.map((session, index) => (
                        <div key={session.id} className="flex gap-4 group">
                          {/* Date Box */}
                          <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-sm">
                            <span className="text-xs text-gray-500 font-medium uppercase">
                              {new Date(session.date).toLocaleString("en-us", {
                                month: "short",
                              })}
                            </span>
                            <span className="text-xl font-bold text-gray-900">
                              {new Date(session.date).getDate()}
                            </span>
                          </div>

                          {/* Session Detail */}
                          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors shadow-sm relative overflow-hidden">
                            {session.status === "completed" && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                            )}
                            {session.status === "upcoming" && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                            )}

                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-gray-900 group-hover:text-[#3961c5] transition-colors">
                                  Buổi {index + 1}: {session.title}
                                </h4>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                    <Clock className="w-4 h-4 text-blue-500" />{" "}
                                    {session.time}
                                  </span>
                                  {session.status === "rescheduled" && (
                                    <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                      <AlertTriangle className="w-4 h-4" /> Đã
                                      đổi lịch: {session.note}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isTutor && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setRescheduleData(session);
                                    setNewSchedule({
                                      date: session.date, // Format yyyy-mm-dd
                                      time: session.time.split(" - ")[0], // Lấy giờ bắt đầu "08:00"
                                      reason: "",
                                      title: session.title || "", // <--- NẠP CHỦ ĐỀ HIỆN TẠI VÀO FORM
                                    });
                                  }}
                                >
                                  <Edit className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                                </Button>
                              )}
                              {/* 👇 NÚT HOÀN THÀNH (ĐÃ SỬA) */}
                              {isTutor && session.status !== "completed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-200 hover:bg-green-50 h-8"
                                  title="Đánh dấu hoàn thành"
                                  onClick={() => setSessionToComplete(session)} // <--- Mở Dialog UI
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" /> Kết
                                  thúc
                                </Button>
                              )}
                              {/* Nút Đánh giá của Student (Chỉ hiện khi đã hoàn thành) */}
                              {!isTutor && session.status === "completed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                                  onClick={() => {
                                    setFeedbackSession(session);
                                    setFeedbackData({ rating: 5, comment: "" }); // Reset form
                                  }}
                                >
                                  <Star className="w-4 h-4 mr-1 fill-current" />{" "}
                                  Đánh giá
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    {/* TAB: MATERIALS */}
                    <TabsContent value="materials">
                      <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[300px] flex flex-col items-center justify-center text-gray-400">
                        <FileText className="w-12 h-12 mb-2 opacity-20" />
                        <p>Chưa có tài liệu nào được tải lên.</p>
                        {isTutor && (
                          <Button variant="outline" className="mt-4">
                            Tải lên ngay
                          </Button>
                        )}
                      </div>
                    </TabsContent>

                    {/* TAB: ASSIGNMENTS */}
                    <TabsContent value="assignments" className="space-y-4">
                      {/* Nút tạo bài tập (Chỉ Tutor) */}
                      {isTutor && (
                        <div className="flex justify-end">
                          <Button
                            className="bg-[#3961c5]"
                            onClick={() => {
                              /* Mở dialog tạo - Bạn tự implement form tạo nhé */
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Tạo bài tập
                          </Button>
                        </div>
                      )}

                      {assignments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          Chưa có bài tập nào.
                        </div>
                      ) : (
                        assignments.map((assign) => {
                          // Tìm bài nộp của chính mình (nếu là Student)
                          const mySubmission = assign.submissions?.find(
                            (s) => s.student_id == userId
                          );

                          return (
                            <div
                              key={assign.id}
                              className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm gap-4"
                            >
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg">
                                  {assign.title}
                                </h4>
                                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="w-3 h-3" /> Hạn:{" "}
                                    {new Date(
                                      assign.deadline
                                    ).toLocaleDateString("vi-VN")}
                                  </span>
                                  {isTutor && (
                                    <span className="flex items-center gap-1 text-blue-600">
                                      <Users className="w-3 h-3" /> Đã nộp:{" "}
                                      {assign.submissions?.length || 0}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div>
                                {isTutor ? (
                                  // --- GIAO DIỆN TUTOR: Nút Chấm Bài ---
                                  <Button
                                    variant="outline"
                                    className="border-[#3961c5] text-[#3961c5] hover:bg-blue-50"
                                    onClick={() => {
                                      setSelectedAssignment(assign);
                                      setIsGradingOpen(true); // Mở Dialog danh sách nộp để chấm
                                    }}
                                  >
                                    <FileText className="w-4 h-4 mr-2" /> Xem &
                                    Chấm bài
                                  </Button>
                                ) : // --- GIAO DIỆN STUDENT: Nút Nộp Bài / Xem Điểm ---
                                mySubmission ? (
                                  <div className="text-right">
                                    <Badge
                                      variant={
                                        mySubmission.score !== null
                                          ? "default"
                                          : "secondary"
                                      }
                                      className={
                                        mySubmission.score !== null
                                          ? "bg-green-600"
                                          : ""
                                      }
                                    >
                                      {mySubmission.score !== null
                                        ? `Điểm: ${mySubmission.score}/10`
                                        : "Đã nộp - Chờ chấm"}
                                    </Badge>
                                    {mySubmission.feedback && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        " {mySubmission.feedback} "
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <Button
                                    className="bg-[#3961c5]"
                                    onClick={() => {
                                      setSelectedAssignment(assign);
                                      setIsSubmissionOpen(true);
                                    }}
                                  >
                                    <Upload className="w-4 h-4 mr-2" /> Nộp bài
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </TabsContent>

                    {/* TAB: STUDENTS */}
                    <TabsContent value="students">
                      {/* Danh sách chờ duyệt (Tutor Only) */}
                      {isTutor &&
                        course.students?.filter((s) => s.status === "pending")
                          .length > 0 && (
                          <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                              <AlertCircle className="w-5 h-5" /> Yêu cầu tham
                              gia
                            </h3>
                            <div className="space-y-3">
                              {course.students
                                .filter((s) => s.status === "pending")
                                .map((std) => (
                                  <div
                                    key={std.id}
                                    className="flex items-center justify-between bg-white p-3 rounded-lg border border-orange-100"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                                        {std.name.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900">
                                          {std.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {std.email}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="h-8 bg-green-600 hover:bg-green-700"
                                        onClick={() =>
                                          approveMutation.mutate({
                                            studentId: std.id,
                                            action: "approve",
                                          })
                                        }
                                      >
                                        Duyệt
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                                        onClick={() =>
                                          approveMutation.mutate({
                                            studentId: std.id,
                                            action: "reject",
                                          })
                                        }
                                      >
                                        Hủy
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                      {/* Danh sách chính thức */}
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                              <th className="px-6 py-4">Họ và tên</th>
                              <th className="px-6 py-4">Email</th>
                              <th className="px-6 py-4 text-right">
                                Hành động
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {course.students
                              ?.filter((s) => s.status === "active")
                              .map((std) => (
                                <tr
                                  key={std.id}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <td
                                    className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3"
                                    onClick={() =>
                                      isTutor && setSelectedStudent(std)
                                    } // Giữ tính năng xem profile cũ
                                  >
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                      {std.name.charAt(0)}
                                    </div>
                                    <div className="cursor-pointer hover:text-blue-600">
                                      {std.name}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-gray-500">
                                    {std.email}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center gap-2">
                                      {/* Nút Xem/Tạo Biên Bản Tiến Độ (Chỉ Admin/Tutor thấy) */}
                                      {(isTutor || userRole === "admin") && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 border-[#3961c5] text-[#3961c5] bg-blue-50 hover:bg-blue-100 gap-1"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setReportDialogStudent(std); // <--- KÍCH HOẠT DIALOG & FETCH DATA
                                          }}
                                        >
                                          <FileText className="w-3.5 h-3.5" />
                                          <span className="hidden sm:inline">
                                            Tiến độ
                                          </span>
                                        </Button>
                                      )}

                                      {/* Nút menu cũ */}
                                      {isTutor && (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() =>
                                            setSelectedStudent(std)
                                          }
                                        >
                                          <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                  </>
                )}
              </div>
            </Tabs>
          </div>

          {/* --- CỘT PHẢI: SIDEBAR (33%) --- */}
          <div className="lg:col-span-1 space-y-6">
            {/* 1. Trạng thái & Hành động (Luôn hiển thị) */}
            <Card className="shadow-sm border-gray-200 overflow-hidden">
              <div className="h-2 bg-[#3961c5]"></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    Trạng thái
                  </span>
                  {course.require_approval ? (
                    <Badge
                      variant="outline"
                      className="border-orange-200 text-orange-700 bg-orange-50"
                    >
                      Cần duyệt
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-green-200 text-green-700 bg-green-50"
                    >
                      Tự do
                    </Badge>
                  )}
                </div>

                {!isTutor ? (
                  <div className="space-y-3">
                    {isActive ? (
                      <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3 text-green-800">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">
                          Bạn đã tham gia lớp này
                        </span>
                      </div>
                    ) : isPending ? (
                      <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-center gap-3 text-orange-800">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">
                          Đang chờ giảng viên duyệt
                        </span>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-[#3961c5] hover:bg-blue-700 text-white font-bold py-6 text-lg shadow-md transition-all hover:-translate-y-0.5"
                        onClick={() => registerMutation.mutate()}
                      >
                        Đăng ký ngay
                      </Button>
                    )}
                    <p className="text-xs text-center text-gray-400">
                      {isActive
                        ? "Chúc bạn học tốt!"
                        : "Nhấn đăng ký để bắt đầu hành trình học tập."}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-center font-medium">
                    Bạn là Giảng viên của lớp này
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2. Thông tin lớp học (Metadata) */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-gray-900">
                  Thông tin chi tiết
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Sĩ số
                  </span>
                  <span className="font-medium text-gray-900">
                    {course.current_students} / {course.max_students}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Địa điểm
                  </span>
                  <span className="font-medium text-gray-900">
                    {course.location}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" /> Lịch học
                  </span>
                  <span
                    className="font-medium text-gray-900 max-w-[150px] truncate text-right"
                    // Tooltip hiển thị đầy đủ khi hover
                    title={
                      course.schedule_text ||
                      (course.sessions?.[0]
                        ? `${course.sessions[0].time} (Bắt đầu: ${new Date(
                            course.sessions[0].date
                          ).toLocaleDateString("vi-VN")})`
                        : "Chưa cập nhật")
                    }
                  >
                    {/* LOGIC HIỂN THỊ: Ưu tiên schedule_text, nếu không có thì tự lấy từ sessions[0] */}
                    {course.schedule_text
                      ? course.schedule_text
                      : course.sessions && course.sessions.length > 0
                      ? `${course.sessions[0].time} (${new Date(
                          course.sessions[0].date
                        ).toLocaleDateString("vi-VN", { weekday: "short" })})`
                      : "Chưa có lịch"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* --- DIALOG DỜI LỊCH / SỬA NỘI DUNG --- */}
      <Dialog
        open={!!rescheduleData}
        onOpenChange={() => setRescheduleData(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật buổi học</DialogTitle>{" "}
            {/* Đổi tiêu đề cho hợp lý */}
            <DialogDescription>
              Chỉnh sửa chủ đề hoặc thời gian cho buổi học này.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 👇 THÊM Ô NHẬP CHỦ ĐỀ Ở ĐÂY */}
            <div className="space-y-2">
              <Label>Chủ đề buổi học</Label>
              <Input
                placeholder="VD: Nhập môn ReactJS..."
                value={newSchedule.title}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, title: e.target.value })
                }
              />
            </div>

            {/* Các phần cũ giữ nguyên */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày mới</Label>
                <Input
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Giờ mới</Label>
                <Input
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, time: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lý do thay đổi (nếu dời lịch)</Label>
              <Input
                placeholder="VD: Giảng viên bận đột xuất..."
                value={newSchedule.reason}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, reason: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => rescheduleMutation.mutate()}
              className="bg-[#3961c5]"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DIALOG HỒ SƠ SINH VIÊN (PHIÊN BẢN PRO) --- */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
      >
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-2xl gap-0">
          {/* 1. Header Cover & Avatar */}
          <DialogHeader className="sr-only">
            <DialogTitle>Hồ sơ học viên: {selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              Xem chi tiết thông tin cá nhân, liên hệ và trạng thái học tập của
              học viên.
            </DialogDescription>
          </DialogHeader>
          <div className="relative h-32 bg-gradient-to-r from-[#3961c5] to-[#60a5fa]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white/80 hover:bg-white/20 hover:text-white"
              onClick={() => setSelectedStudent(null)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <DialogHeader>
            <DialogTitle>Thông tin học viên</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="px-6 pb-6 -mt-12 bg-white">
              <div className="flex justify-between items-end">
                <Avatar className="w-24 h-24 border-4 border-white shadow-md bg-white">
                  {/* Cách viết chuẩn giống Tutor: Chỉ truyền src, tự động fallback nếu lỗi */}
                  <AvatarImage
                    src={selectedStudent.avatarUrl}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-100 text-slate-500 text-2xl font-bold">
                    {selectedStudent.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-2 mb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Mail className="w-4 h-4 mr-2" /> Nhắn tin
                  </Button>
                  {isTutor && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-none"
                    >
                      Xóa
                    </Button>
                  )}
                </div>
              </div>

              {/* 2. Tên & MSSV */}
              <div className="mt-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedStudent.name}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <Badge
                    variant="secondary"
                    className="font-normal bg-gray-100 text-gray-600"
                  >
                    Học viên
                  </Badge>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" /> Thông tin chung
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* 3. Thông tin chi tiết (Grid Layout) */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="space-y-1">
                  <span className="text-gray-400 text-xs uppercase font-semibold">
                    Email liên hệ
                  </span>
                  <div
                    className="flex items-center gap-2 text-gray-700 font-medium truncate"
                    title={selectedStudent.email}
                  >
                    <Mail className="w-4 h-4 text-blue-500" />
                    {selectedStudent.email}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400 text-xs uppercase font-semibold">
                    Ngày tham gia
                  </span>
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <CalendarIcon className="w-4 h-4 text-blue-500" />
                    {selectedStudent.enrolledAt
                      ? new Date(selectedStudent.enrolledAt).toLocaleDateString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400 text-xs uppercase font-semibold">
                    Trạng thái
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 px-2 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5 animate-pulse"></span>
                      Đang học
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400 text-xs uppercase font-semibold">
                    Chuyên cần
                  </span>
                  <div className="flex items-center gap-2 text-gray-900 font-bold">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    --{" "}
                    <span className="text-gray-400 font-normal text-xs">
                      (Chưa có dữ liệu)
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Footer Note */}
              <div className="mt-6 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500 flex gap-2">
                <Info className="w-4 h-4 shrink-0 text-slate-400" />
                <p>Hồ sơ học viên được cập nhật tự động từ hệ thống quản lý.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* --- DIALOG BÁO CÁO TIẾN ĐỘ (REAL DATA) --- */}
      <Dialog
        open={!!reportDialogStudent}
        onOpenChange={(open) => !open && setReportDialogStudent(null)}
      >
        {/* SỬA 1: Dùng max-h và overflow-y-auto giống SessionReportEnhanced */}
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {/* SỬA 2: Bỏ sticky header, để nó cuộn tự nhiên */}
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center justify-between pr-8">
              <div>
                <DialogTitle className="text-xl text-[#3961c5] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tiến độ: {reportDialogStudent?.name}
                </DialogTitle>
                <DialogDescription>
                  Dữ liệu đánh giá chi tiết từ giảng viên.
                </DialogDescription>
              </div>
              {isTutor && (
                <Button
                  size="sm"
                  className="bg-[#3961c5] hover:bg-blue-700"
                  onClick={() => setIsCreateReportOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-1" /> Tạo biên bản
                </Button>
              )}
            </div>
          </DialogHeader>

          {isLoadingReports ? (
            <div className="py-12 flex justify-center items-center text-gray-400">
              <Activity className="w-6 h-6 animate-spin mr-2" /> Đang tải dữ
              liệu...
            </div>
          ) : (
            <div className="py-4">
              {" "}
              {/* Thêm wrapper padding */}
              {/* THỐNG KÊ */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <span className="text-xs text-blue-600 font-bold uppercase flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Số buổi học
                  </span>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {reportStats.count}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      buổi
                    </span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <span className="text-xs text-green-600 font-bold uppercase flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Mức độ hiểu bài
                  </span>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {reportStats.comprehension}%
                  </div>
                  <div className="w-full bg-green-200 h-1.5 rounded-full mt-2">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: `${reportStats.comprehension}%` }}
                    ></div>
                  </div>
                </div>
                {/* Cập nhật cuối */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <span className="text-xs text-purple-600 font-bold uppercase flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" /> Cập nhật cuối
                  </span>
                  <div className="text-lg font-bold text-gray-900 mt-1">
                    {reportStats.lastDate
                      ? new Date(reportStats.lastDate).toLocaleDateString(
                          "vi-VN"
                        )
                      : "--/--"}
                  </div>
                </div>
              </div>
              <Separator className="mb-6" />
              {/* DANH SÁCH CHI TIẾT */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2 text-gray-900">
                  <FileText className="w-4 h-4" /> Chi tiết từng buổi
                </h4>

                {/* SỬA 3: Bỏ ScrollArea, dùng div thường */}
                <div className="space-y-3 pb-4">
                  {studentReports.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      Chưa có dữ liệu biên bản nào.
                    </div>
                  ) : (
                    studentReports.map((report) => (
                      <div
                        key={report.id}
                        className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all bg-white group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-[#3961c5] transition-colors">
                              {report.topicsCovered?.join(", ") ||
                                "Không có chủ đề"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs">
                                <CalendarIcon className="w-3 h-3" />{" "}
                                {!report.sessionDate ||
                                isNaN(new Date(report.sessionDate).getTime())
                                  ? new Date().toLocaleDateString("vi-VN")
                                  : new Date(
                                      report.sessionDate
                                    ).toLocaleDateString("vi-VN")}
                              </span>
                              <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs">
                                <Clock className="w-3 h-3" />{" "}
                                {report.sessionTime &&
                                !report.sessionTime.includes("Invalid")
                                  ? report.sessionTime
                                  : "Vừa xong"}
                              </span>
                            </div>
                          </div>
                          <Badge className="capitalize">
                            {report.comprehensionLevel}
                          </Badge>
                        </div>

                        <div className="bg-slate-50 p-3 rounded text-sm text-gray-600 mt-3 border border-slate-100">
                          {report.progressNotes || "Không có ghi chú thêm."}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-50 flex flex-col gap-2">
                          {report.strengths?.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {report.strengths.map((s, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-100"
                                >
                                  +{s}
                                </span>
                              ))}
                            </div>
                          )}
                          {report.areasForImprovement?.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {report.areasForImprovement.map((s, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100"
                                >
                                  ! {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-2 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-gray-400 hover:text-[#3961c5]"
                            onClick={() => handleViewReport(report)}
                          >
                            Xem chi tiết{" "}
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* --- DIALOG FORM TẠO BIÊN BẢN MỚI --- */}
      <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tạo đánh giá mới</DialogTitle>
            <DialogDescription>
              Ghi nhận tiến độ cho học viên: <b>{reportDialogStudent?.name}</b>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* 1. Mức độ hiểu bài */}
            <div className="space-y-2">
              <Label>Mức độ hiểu bài</Label>
              <select
                className="w-full p-2 border rounded-md text-sm"
                value={newReport.comprehension}
                onChange={(e) =>
                  setNewReport({ ...newReport, comprehension: e.target.value })
                }
              >
                <option value="excellent">Xuất sắc</option>
                <option value="good">Tốt</option>
                <option value="fair">Khá</option>
                <option value="poor">Yếu</option>
              </select>
            </div>

            {/* 2. Chủ đề đã học */}
            <div className="space-y-2">
              <Label>Chủ đề</Label>
              <Input
                placeholder="VD: React Hooks, State, Props..."
                value={newReport.topics}
                onChange={(e) =>
                  setNewReport({ ...newReport, topics: e.target.value })
                }
              />
            </div>

            {/* 3. Điểm mạnh */}
            <div className="space-y-2">
              <Label>Điểm mạnh</Label>
              <Input
                placeholder="VD: Tư duy tốt, Chăm chỉ..."
                value={newReport.strengths}
                onChange={(e) =>
                  setNewReport({ ...newReport, strengths: e.target.value })
                }
              />
            </div>
            {/* 👇 INPUT CẦN CẢI THIỆN MỚI */}
            <div className="space-y-2">
              <Label className="text-orange-700">Cần cải thiện (!)</Label>
              <Input
                placeholder="VD: Quên kiến thức cũ..."
                value={newReport.improvements}
                onChange={(e) =>
                  setNewReport({ ...newReport, improvements: e.target.value })
                }
              />
            </div>
            {/* 4. Ghi chú chi tiết */}
            <div className="space-y-2">
              <Label>Nhận xét / Ghi chú</Label>
              <textarea
                className="w-full min-h-[80px] p-2 border rounded-md text-sm"
                placeholder="Nhận xét chi tiết về buổi học..."
                value={newReport.notes}
                onChange={(e) =>
                  setNewReport({ ...newReport, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateReportOpen(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-[#3961c5]"
              onClick={() => createReportMutation.mutate(newReport)}
              disabled={createReportMutation.isPending}
            >
              {createReportMutation.isPending ? "Đang lưu..." : "Lưu biên bản"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* --- DIALOG CHI TIẾT / SỬA / XÓA --- */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Chỉnh sửa biên bản" : "Chi tiết biên bản"}
            </DialogTitle>
            <DialogDescription>
              {new Date(selectedReport?.sessionDate).toLocaleDateString(
                "vi-VN"
              )}{" "}
              - {selectedReport?.sessionTime}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 py-2">
              {/* 1. Mức độ hiểu bài */}
              <div className="space-y-2">
                <Label>Mức độ hiểu bài</Label>
                {isEditing ? (
                  <select
                    className="w-full p-2 border rounded-md text-sm"
                    value={editFormData.comprehension}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        comprehension: e.target.value,
                      })
                    }
                  >
                    <option value="excellent">Xuất sắc</option>
                    <option value="good">Tốt</option>
                    <option value="fair">Khá</option>
                    <option value="poor">Yếu</option>
                  </select>
                ) : (
                  <Badge
                    className={`capitalize ${
                      selectedReport.comprehensionLevel === "excellent"
                        ? "bg-green-100 text-green-700"
                        : selectedReport.comprehensionLevel === "good"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {selectedReport.comprehensionLevel}
                  </Badge>
                )}
              </div>

              {/* 2. Chủ đề */}
              <div className="space-y-2">
                <Label>Chủ đề</Label>
                {isEditing ? (
                  <Input
                    value={editFormData.topics}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        topics: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">
                    {selectedReport.topicsCovered?.join(", ") || "Không có"}
                  </div>
                )}
              </div>

              {/* 3. Điểm mạnh */}
              <div className="space-y-2">
                <Label>Điểm mạnh</Label>
                {isEditing ? (
                  <Input
                    value={editFormData.strengths}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        strengths: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {selectedReport.strengths?.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-100"
                      >
                        +{s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* 👇 CẦN CẢI THIỆN */}
              <div className="space-y-2">
                <Label className="text-orange-700">Cần cải thiện</Label>
                {isEditing ? (
                  <Input
                    value={editFormData.improvements}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        improvements: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {selectedReport.areasForImprovement?.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-100"
                      >
                        ! {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* 4. Ghi chú */}
              <div className="space-y-2">
                <Label>Ghi chú</Label>
                {isEditing ? (
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded-md text-sm"
                    value={editFormData.notes}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        notes: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 min-h-[60px]">
                    {selectedReport.progressNotes}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {isEditing ? (
              // --- Nút khi đang Sửa ---
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Hủy bỏ
                </Button>
                <Button
                  className="bg-[#3961c5]"
                  onClick={() => updateReportMutation.mutate()}
                  disabled={updateReportMutation.isPending}
                >
                  Lưu thay đổi
                </Button>
              </>
            ) : (
              // --- Nút khi đang Xem ---
              <>
                {isTutor && (
                  <>
                    <Button
                      variant="destructive"
                      className="mr-auto bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Bạn có chắc muốn xóa biên bản này không?"
                          )
                        ) {
                          deleteReportMutation.mutate();
                        }
                      }}
                    >
                      Xóa
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
                    </Button>
                  </>
                )}
                <Button variant="ghost" onClick={() => setSelectedReport(null)}>
                  Đóng
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* --- 1. DIALOG NỘP BÀI (STUDENT) --- */}
      <Dialog open={isSubmissionOpen} onOpenChange={setIsSubmissionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nộp bài tập: {selectedAssignment?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label>Link bài làm (Google Drive/Github...)</Label>
            <Input
              placeholder="https://..."
              value={submissionFile}
              onChange={(e) => setSubmissionFile(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => submitAssignmentMutation.mutate()}
              className="bg-[#3961c5]"
            >
              Gửi bài
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- 2. DIALOG CHẤM BÀI (TUTOR) --- */}
      <Dialog open={isGradingOpen} onOpenChange={setIsGradingOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Chấm bài: {selectedAssignment?.title}</DialogTitle>
            <DialogDescription>
              Danh sách sinh viên đã nộp bài
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 font-medium text-gray-500">
                <tr>
                  <th className="p-3">Sinh viên</th>
                  <th className="p-3">Ngày nộp</th>
                  <th className="p-3">Link bài</th>
                  <th className="p-3 w-32">Điểm</th>
                  <th className="p-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedAssignment?.submissions?.map((sub) => (
                  <tr key={sub.id}>
                    <td className="p-3 font-medium">
                      {/* Cần include User để lấy tên, tạm thời hiện ID */}
                      SV #{sub.student_id}
                    </td>
                    <td className="p-3">
                      {new Date(sub.submitted_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-3">
                      <a
                        href={sub.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        Mở link <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        defaultValue={sub.score}
                        className="w-20 h-8"
                        id={`score-${sub.id}`}
                      />
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const scoreVal = document.getElementById(
                            `score-${sub.id}`
                          ).value;
                          gradeMutation.mutate({
                            submissionId: sub.id,
                            score: scoreVal,
                            feedback: "Tốt",
                          });
                        }}
                      >
                        Lưu
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!selectedAssignment?.submissions ||
                  selectedAssignment.submissions.length === 0) && (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      Chưa có ai nộp bài
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
      {/* --- DIALOG ĐÁNH GIÁ CHẤT LƯỢNG (STUDENT) --- */}
      <Dialog
        open={!!feedbackSession}
        onOpenChange={(open) => !open && setFeedbackSession(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đánh giá buổi học</DialogTitle>
            <DialogDescription>
              Buổi: {feedbackSession?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Label>Chất lượng buổi học</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFeedbackData({ ...feedbackData, rating: star })
                    }
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= feedbackData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm font-medium text-yellow-600">
                {feedbackData.rating === 5 && "Tuyệt vời!"}
                {feedbackData.rating === 4 && "Rất tốt"}
                {feedbackData.rating === 3 && "Bình thường"}
                {feedbackData.rating === 2 && "Cần cải thiện"}
                {feedbackData.rating === 1 && "Tệ"}
              </span>
            </div>

            <div className="space-y-2">
              <Label>Nhận xét của bạn</Label>
              <Textarea
                placeholder="Giảng viên dạy thế nào? Bạn có hiểu bài không?"
                rows={3}
                value={feedbackData.comment}
                onChange={(e) =>
                  setFeedbackData({ ...feedbackData, comment: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackSession(null)}>
              Để sau
            </Button>
            <Button
              className="bg-[#3961c5]"
              onClick={() => feedbackMutation.mutate()}
              disabled={feedbackMutation.isPending}
            >
              Gửi đánh giá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* --- DIALOG XÁC NHẬN HOÀN THÀNH BUỔI HỌC (LMS BLUE) --- */}
      <Dialog
        open={!!sessionToComplete}
        onOpenChange={(open) => !open && setSessionToComplete(null)}
      >
        <DialogContent className="max-w-md rounded-xl border border-gray-200 shadow-xl">
          <DialogHeader className="space-y-3 text-center">
            <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>

            <DialogTitle className="text-lg font-semibold text-slate-800">
              Xác nhận hoàn thành buổi học
            </DialogTitle>

            <DialogDescription className="text-sm text-slate-600 pt-1 leading-relaxed">
              Bạn có chắc chắn muốn đánh dấu buổi học{" "}
              <span className="font-semibold text-slate-800">
                "{sessionToComplete?.title}"
              </span>{" "}
              là đã kết thúc?
              <span className="block text-xs text-slate-500 mt-2">
                Sau khi xác nhận, sinh viên có thể gửi đánh giá về buổi học này.
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2 sm:justify-center pt-4">
            <Button
              variant="outline"
              className="
          border-gray-300
          text-gray-700
          hover:bg-gray-100
        "
              onClick={() => setSessionToComplete(null)}
            >
              Hủy bỏ
            </Button>

            <Button
              className="
          bg-brand-gradient   
          hover:bg-brand-gradient
          text-white
        "
              onClick={() => {
                if (sessionToComplete) {
                  completeSessionMutation.mutate(sessionToComplete.id);
                  setSessionToComplete(null);
                }
              }}
              disabled={completeSessionMutation.isPending}
            >
              {completeSessionMutation.isPending
                ? "Đang xử lý..."
                : "Xác nhận hoàn thành"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
