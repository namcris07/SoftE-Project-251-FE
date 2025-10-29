import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Upload,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  FileText,
  Video,
  Image,
  BookOpen,
  Star,
} from "lucide-react";
import { Footer } from "../components/layout/Footer";

export function DocumentManagement({ user, onNavigate }) {
  const fileInputRef = React.useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  // ==========================
  // 🔹 Form & Upload Logic (Tutor)
  // ==========================
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "lecture",
    type: "pdf",
    access: "public",
    file: null,
  });

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!form.file) {
      alert("❗Bạn chưa chọn file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", form.file);
    formData.append("title", form.title || form.file.name);
    formData.append("description", form.description || "");
    formData.append("category", form.category || "lecture");
    formData.append("type", form.type || "pdf");
    formData.append("access", form.access || "public");
    formData.append("tutorId", user?.id || 0);

    try {
      const res = await fetch("http://localhost:3000/api/documents/upload", {
        method: "POST",
        body: formData, // ⚠️ KHÔNG thêm headers Content-Type ở đây
      });

      // Đọc phản hồi backend
      const data = await res.json();
      console.log("📡 Upload response:", data);

      if (res.ok) {
        alert("📤 Upload thành công!");
        setForm({
          title: "",
          description: "",
          category: "lecture",
          type: "pdf",
          access: "public",
          file: null,
        });

        // 🔁 Cập nhật lại danh sách
        await fetchDocuments();
      } else {
        console.error("❌ Upload thất bại!", data);
        alert(`❌ Upload thất bại: ${data.message || "Lỗi không xác định"}`);
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert(
        "🚨 Lỗi khi gửi yêu cầu tới server. Kiểm tra console để biết thêm chi tiết!"
      );
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa tài liệu này?")) return;
    const res = await fetch(`http://localhost:3000/api/documents/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("🗑️ Đã xóa tài liệu!");
      fetchDocuments();
    } else {
      alert("❌ Xóa thất bại!");
    }
  };


  const filteredDocuments = documents.filter((doc) => {
    const title = (doc.title || "").toLowerCase();
    const author = (doc.author || "").toLowerCase();

    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      author.includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;

    const matchesType = selectedType === "all" || doc.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });


  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return FileText;
      case "video":
        return Video;
      case "doc":
      case "docx":
        return FileText;
      case "jpg":
      case "png":
        return Image;
      default:
        return FileText;
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-800";
      case "video":
        return "bg-purple-100 text-purple-800";
      case "doc":
      case "docx":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "lecture":
        return "Bài giảng";
      case "exercise":
        return "Bài tập";
      case "exam":
        return "Đề thi";
      case "reference":
        return "Tài liệu tham khảo";
      default:
        return category;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "lecture":
        return "bg-[#A7C6ED] text-[#0388B4]";
      case "exercise":
        return "bg-green-100 text-green-800";
      case "exam":
        return "bg-yellow-100 text-yellow-800";
      case "reference":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  // ==========================
  // 🔹 FETCH DOCUMENTS
  // ==========================
  const fetchDocuments = async () => {
    try {
      let url = "";
      if (user.role === "student") url = "http://localhost:3000/api/documents";
      if (user.role === "tutor")
        url = `http://localhost:3000/api/documents/mine/${user.id}`;
      if (user.role === "admin")
        url = "http://localhost:3000/api/admin/documents";

      const res = await fetch(url);
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Lỗi tải tài liệu:", err);
    }
  };

  const fetchStats = async () => {
    if (user.role !== "admin") return;
    try {
      const res = await fetch(
        "http://localhost:3000/api/admin/documents/stats"
      );
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("❌ Lỗi tải thống kê:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.role, user.id]);

  // 👨‍🎓 STUDENT
  const renderStudentView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-[#0388B4]" />
            <span>Tìm kiếm tài liệu</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Từ khóa</Label>
              <Input
                id="search"
                placeholder="Nhập tên tài liệu hoặc tác giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label>Loại tài liệu</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
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

      {/* Document list */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filteredDocuments.map((doc) => {
          const Icon = getFileIcon(doc.type);
          return (
            <Card key={doc.id} className="hover:shadow-lg transition">
              <CardContent className="p-4 flex space-x-4">
                <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-8 w-8 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{doc.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {doc.description}
                  </p>
                  <div className="flex flex-wrap gap-2 my-1">
                    <Badge className={getCategoryColor(doc.category)}>
                      {getCategoryLabel(doc.category)}
                    </Badge>
                    <Badge className={getFileTypeColor(doc.type)}>
                      {doc.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>{doc.author}</span>
                    <span>{doc.size}</span>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={`http://localhost:3000/uploads/${doc.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 rounded bg-[#0388B4] text-white text-sm hover:bg-[#027197]"
                    >
                      <Eye className="h-4 w-4 mr-1" /> Xem
                    </a>
                    <Button
                      onClick={async () => {
                        try {
                          // 🔹 Gửi yêu cầu tăng lượt tải
                          await fetch(
                            `http://localhost:3000/api/documents/${doc.id}/download`,
                            {
                              method: "PUT",
                            }
                          );

                          // 🔹 Sau đó thực hiện tải file thật
                          window.open(
                            `http://localhost:3000/uploads/${doc.file_path}`,
                            "_blank"
                          );

                          // 🔹 Cập nhật lại danh sách để thấy số lượt tải mới
                          fetchDocuments();
                        } catch (err) {
                          console.error("❌ Lỗi tải file:", err);
                        }
                      }}
                      variant="outline"
                      className="border-[#0388B4] text-[#0388B4] text-sm hover:bg-[#F0F9FF] inline-flex items-center px-3 py-1 rounded"
                    >
                      <Download className="h-4 w-4 mr-1" /> Tải
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // 👩‍🏫 TUTOR
  const renderTutorView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-[#0388B4]" />
              <span>Quản lý tài liệu</span>
            </div>
            {/* input file ẩn đi, không hiện trên UI */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,.ppt,.mp4"
              style={{ display: "none" }}
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                  setForm({ ...form, file: selectedFile });
                  // ✅ gọi upload luôn sau khi chọn file
                }
              }}
            />

            {/* Nút hiển thị — khi bấm thì mở hộp chọn file */}
            <Button
              className="bg-[#0388B4] text-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" /> Tải lên tài liệu
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">
              Kéo thả file vào đây hoặc nhấn để chọn tài liệu
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Hỗ trợ: PDF, DOC, PPT, MP4 (tối đa 50MB)
            </p>

            {/* 🧩 Input file */}
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.mp4"
              onChange={(e) => {
                const selected = e.target.files[0];
                if (selected) setForm({ ...form, file: selected });
              }}
              className="mt-2 mb-3"
            />

            {/* 🧾 Thông tin file được chọn */}
            {form.file && (
              <p className="text-sm text-gray-700 mb-3">
                📄 <strong>{form.file.name}</strong> (
                {(form.file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}

            {/* 🧠 Các thông tin mô tả và phân loại */}
            <div className="grid md:grid-cols-2 gap-4 text-left mb-4">
              <div>
                <Label htmlFor="title">Tên tài liệu</Label>
                <Input
                  id="title"
                  placeholder="VD: Bài giảng Giải tích 1"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="category">Phân loại</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại tài liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecture">Bài giảng</SelectItem>
                    <SelectItem value="exercise">Bài tập</SelectItem>
                    <SelectItem value="exam">Đề thi</SelectItem>
                    <SelectItem value="reference">
                      Tài liệu tham khảo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 🧠 Khi nhấn mới upload */}
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleUpload(e);
              }}
              className="mt-4 bg-[#0388B4] text-white"
            >
              📤 Tải lên
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tài liệu của tôi</CardTitle>
          <CardDescription>Quản lý các tài liệu bạn đã tải lên</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.map((doc) => {
            const Icon = getFileIcon(doc.type);

            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg mb-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{doc.title}</h4>
                    <p className="text-sm text-gray-500">
                      {doc.size} • {doc.downloads} lượt tải
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#0388B4] text-[#0388B4]"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-500"
                    onClick={() => handleDelete(doc.id)} // ✅ dùng handleDelete global
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );


  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <h1 className="text-3xl font-medium text-gray-900 mb-4">
          Quản lý tài liệu
        </h1>
        <p className="text-gray-600 mb-6">
          {user.role === "student"
            ? "Tìm kiếm và tải về tài liệu học tập"
            : user.role === "tutor"
            ? "Quản lý và chia sẻ tài liệu giảng dạy"
          : ""}
        </p>

        {user.role === "student" && renderStudentView()}
        {user.role === "tutor" && renderTutorView()}

        {filteredDocuments.length === 0 && searchTerm && (
          <Card className="mt-6">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Không tìm thấy tài liệu phù hợp</p>
              <p className="text-sm text-gray-500 mt-2">
                Thử thay đổi từ khóa hoặc bộ lọc tìm kiếm
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* 🔹 Footer cố định dưới cùng */}
      <Footer />
    </div>
  );
}
