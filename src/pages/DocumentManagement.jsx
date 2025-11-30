import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Upload,
  Search,
  Download,
  Eye,
  FileText,
  Trash2,
  Video,
  Image,
  CheckCircle,
  XCircle,
  Clock,
  CloudUpload,
} from "lucide-react";
import { toast } from "sonner";
import axiosClient from "../api/axiosClient";
import { Footer } from "../components/layout/Footer";
// --- Helper Functions ---
const getFileIcon = (type) => {
  const t = type?.toLowerCase() || "file";
  if (["pdf", "doc", "docx"].includes(t)) return FileText;
  if (["mp4", "avi", "mov"].includes(t)) return Video;
  if (["jpg", "png", "jpeg"].includes(t)) return Image;
  return FileText;
};

const getCategoryLabel = (cat) =>
  ({
    lecture: "Bài giảng",
    exercise: "Bài tập",
    exam: "Đề thi",
    reference: "Tham khảo",
  }[cat] || cat);

const getCategoryColor = (category) => {
  switch (category) {
    case "lecture":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "exercise":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "exam":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "reference":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
          Đã duyệt
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
          Từ chối
        </Badge>
      );
    default:
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200">
          Chờ duyệt
        </Badge>
      );
  }
};

export function DocumentManagement({ user: propUser }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const user = propUser || {
    id: localStorage.getItem("userId"),
    role: localStorage.getItem("role"),
    name: localStorage.getItem("userName"),
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [adminFilterStatus, setAdminFilterStatus] = useState("all");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "lecture",
    access: "public",
    file: null,
  });

  // ===========================
  // 1. Data Fetching
  // ===========================
  const { data: documents = [], isLoading } = useQuery({
    queryKey: [
      "documents",
      user?.role,
      user?.id,
      selectedCategory,
      searchTerm,
      adminFilterStatus,
    ],
    queryFn: async () => {
      if (!user?.role) return [];

      let url = "/documents";
      const params = {};

      if (user.role === "admin") {
        url = "/admin/documents";
        if (adminFilterStatus !== "all") params.status = adminFilterStatus;
        if (searchTerm) params.keyword = searchTerm;
      } else if (user.role === "tutor") {
        url = `/documents/mine/${user.id}`;
        if (searchTerm) params.search = searchTerm;
      } else {
        if (selectedCategory !== "all") params.category = selectedCategory;
        if (searchTerm) params.search = searchTerm;
      }

      const res = await axiosClient.get(url, { params });
      return Array.isArray(res) ? res : [];
    },
    enabled: !!user?.role,
  });

  const { data: stats } = useQuery({
    queryKey: ["documentStats"],
    queryFn: async () => {
      if (user?.role !== "admin") return null;
      return await axiosClient.get("/admin/documents/stats");
    },
    enabled: user?.role === "admin",
  });

  // ===========================
  // 2. Mutations
  // ===========================
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!form.file) throw new Error("Chưa chọn file!");

      const formData = new FormData();
      formData.append("file", form.file);
      formData.append("title", form.title || form.file.name);
      formData.append("description", form.description || "");
      formData.append("category", form.category);
      formData.append("access", form.access);
      formData.append("tutorId", user.id);

      const ext = form.file.name.split(".").pop();
      formData.append("type", ext);

      return await axiosClient.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Upload thành công!");
      setForm({
        title: "",
        description: "",
        category: "lecture",
        access: "public",
        file: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries(["documents"]);
    },
    onError: (err) =>
      toast.error(
        "Lỗi upload: " + (err.response?.data?.message || err.message)
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosClient.delete(`/documents/${id}`),
    onSuccess: () => {
      toast.success("Đã xóa tài liệu!");
      queryClient.invalidateQueries(["documents"]);
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async ({ id, filePath }) => {
      await axiosClient.put(`/documents/${id}/download`);
      const fileUrl = `http://localhost:3000/uploads/${filePath}`;
      window.open(fileUrl, "_blank");
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => axiosClient.put(`/admin/documents/approve/${id}`),
    onSuccess: () => {
      toast.success("Đã duyệt!");
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["documentStats"]);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => axiosClient.put(`/admin/documents/reject/${id}`),
    onSuccess: () => {
      toast.success("Đã từ chối!");
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["documentStats"]);
    },
  });

  // ===========================
  // 3. RENDER VIEWS
  // ===========================

  // --- ADMIN VIEW ---
  const renderAdminView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-yellow-50 border-yellow-200 shadow-none">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-yellow-700">Chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-800">
                {stats?.pending || 0}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200 shadow-none">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-700">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-800">
                {stats?.approved || 0}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200 shadow-none">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-red-700">Bị từ chối</p>
              <p className="text-2xl font-bold text-red-800">
                {stats?.rejected || 0}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Danh sách tài liệu</CardTitle>
            <Tabs
              value={adminFilterStatus}
              onValueChange={setAdminFilterStatus}
            >
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
                <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
                <TabsTrigger value="rejected">Từ chối</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm theo tên..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded text-[#3961c5]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.title}</p>
                    <div className="flex gap-2 text-sm text-gray-500">
                      <span>{doc.author}</span> •{" "}
                      <span>
                        {new Date(doc.upload_date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(doc.status)}
                  {doc.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 text-white h-8 hover:bg-green-700"
                        onClick={() => approveMutation.mutate(doc.id)}
                      >
                        Duyệt
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 h-8 hover:bg-red-50"
                        onClick={() => rejectMutation.mutate(doc.id)}
                      >
                        Từ chối
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-blue-600 h-8 w-8 p-0"
                    onClick={() =>
                      downloadMutation.mutate({
                        id: doc.id,
                        filePath: doc.file_path,
                      })
                    }
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 h-8 w-8 p-0 hover:bg-red-50"
                    onClick={() => {
                      if (confirm("Xóa vĩnh viễn?"))
                        deleteMutation.mutate(doc.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {documents.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                Không có dữ liệu.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // --- ✅ TUTOR VIEW (LAYOUT MỚI 2 CỘT) ---
  const renderTutorView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* CỘT TRÁI: FORM UPLOAD (Chiếm 4/12) */}
      <div className="lg:col-span-4">
        <Card className="sticky top-6 shadow-sm border-blue-100">
          <CardHeader className="bg-blue-50/50 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-[#3961c5]">
              <CloudUpload className="h-5 w-5" /> Upload Tài Liệu
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div
              className="border-2 border-dashed border-blue-200 bg-blue-50/30 p-6 text-center rounded-xl cursor-pointer hover:bg-blue-50 transition-all group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="bg-white p-3 rounded-full inline-block mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6 text-[#3961c5]" />
              </div>
              <p className="text-gray-700 font-medium text-sm">
                Kéo thả hoặc nhấn để chọn file
              </p>
              <p className="text-xs text-gray-400 mt-1">
                (PDF, DOC, MP4 - Max 50MB)
              </p>

              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setForm({ ...form, file });
                }}
              />
            </div>

            {form.file && (
              <div className="mt-3 bg-green-50 border border-green-100 p-2 rounded text-sm text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="truncate max-w-[200px]">{form.file.name}</span>
              </div>
            )}

            <div
              className="grid grid-cols-1 gap-4 text-left mt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <Label className="text-sm font-semibold text-gray-600">
                  Tên tài liệu
                </Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="VD: Bài giảng Chương 1"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-600">
                  Phân loại
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecture">Bài giảng</SelectItem>
                    <SelectItem value="exercise">Bài tập</SelectItem>
                    <SelectItem value="exam">Đề thi</SelectItem>
                    <SelectItem value="reference">Tham khảo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                uploadMutation.mutate();
              }}
              className="mt-6 w-full bg-brand-gradient text-white shadow-md"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending
                ? "Đang tải lên..."
                : "Xác nhận tải lên"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CỘT PHẢI: DANH SÁCH (Chiếm 8/12) */}
      <div className="lg:col-span-8">
        <Card className="shadow-sm min-h-[500px]">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <CardTitle className="text-lg">Kho tài liệu của tôi</CardTitle>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm tài liệu..."
                  className="pl-9 h-10 bg-gray-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-blue-50/50 transition-colors group bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#3961c5] group-hover:bg-blue-100 transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Badge
                          variant="outline"
                          className="text-xs font-normal text-gray-600 bg-white"
                        >
                          {getCategoryLabel(doc.category)}
                        </Badge>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.downloads} tải</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    {getStatusBadge(doc.status)}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                      onClick={() => {
                        if (confirm("Bạn có chắc muốn xóa tài liệu này?"))
                          deleteMutation.mutate(doc.id);
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
              {documents.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    Chưa có tài liệu nào được tải lên.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // --- STUDENT VIEW ---
  const renderStudentView = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#3961c5]">
            <Search className="h-5 w-5" /> Tìm kiếm tài liệu học tập
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label className="mb-2 block text-gray-600">Từ khóa</Label>
              <Input
                placeholder="Nhập tên môn học, giáo trình..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white"
              />
            </div>
            <div>
              <Label className="mb-2 block text-gray-600">Loại tài liệu</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="lecture">Bài giảng</SelectItem>
                  <SelectItem value="exercise">Bài tập</SelectItem>
                  <SelectItem value="exam">Đề thi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {documents.map((doc) => {
          const Icon = getFileIcon(doc.type);
          return (
            <Card
              key={doc.id}
              className="hover:shadow-lg transition border-gray-200 group cursor-pointer"
            >
              <CardContent className="p-5 flex space-x-5">
                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <Icon className="h-8 w-8 text-gray-400 group-hover:text-[#3961c5]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-[#3961c5] transition-colors">
                      {doc.title}
                    </h3>
                    <Badge variant="outline" className="uppercase text-[10px]">
                      {doc.type}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-3">
                    {doc.description || "Không có mô tả chi tiết."}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getCategoryColor(doc.category)}>
                      {getCategoryLabel(doc.category)}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-400">
                      <span>Đăng bởi: {doc.author}</span>
                      <span className="mx-2">•</span>
                      <span>{doc.size}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[#3961c5] border-blue-100 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadMutation.mutate({
                          id: doc.id,
                          filePath: doc.file_path,
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" /> Tải về
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {documents.length === 0 && (
          <div className="col-span-2 text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              Không tìm thấy tài liệu nào phù hợp.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
  <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
    <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === "admin"
              ? "Kiểm duyệt Tài liệu"
              : user?.role === "tutor"
              ? "Quản lý Thư viện"
              : "Thư viện Tài liệu"}
          </h1>
          <p className="text-gray-500 mt-1">
            {user?.role === "admin"
              ? "Quản lý và xét duyệt tài liệu hệ thống"
              : user?.role === "tutor"
              ? "Tải lên và quản lý tài liệu giảng dạy của bạn"
              : "Tìm kiếm và tải về tài liệu học tập chất lượng cao"}
          </p>
        </div>
      </div>

      {user?.role === "admin" && renderAdminView()}
      {user?.role === "tutor" && renderTutorView()}
      {user?.role === "student" && renderStudentView()}
    </main>

    <Footer />
  </div>
);
}
