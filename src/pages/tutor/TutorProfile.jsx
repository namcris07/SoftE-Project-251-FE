import React, { useState, useEffect, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Footer } from "../../components/layout/Footer";
import {
  Edit,
  Star,
  Upload,
  Phone,
  Mail,
  BookOpen,
  Save,
  X,
  Plus,
  XCircle,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";

// --- 1. DỮ LIỆU KHOA - BỘ MÔN (Dành cho Giảng viên) ---
const FACULTY_DATA = [
  {
    name: "Khoa Cơ khí",
    departments: [
      "Bảo dưỡng công nghiệp",
      "Kỹ thuật cơ khí",
      "Công nghệ dệt, may",
      "Kỹ thuật cơ điện tử",
      "Kỹ thuật dệt",
      "Kỹ thuật hệ thống công nghiệp",
      "Logistics và quản lý chuỗi cung ứng",
      "Kỹ thuật nhiệt",
    ],
  },
  {
    name: "Khoa Kỹ thuật Địa chất và Dầu khí",
    departments: ["Kỹ thuật địa chất", "Kỹ thuật dầu khí", "Địa kỹ thuật xây dựng"],
  },
  {
    name: "Khoa Điện - Điện tử",
    departments: [
      "Kỹ thuật điều khiển và tự động hóa",
      "Kỹ thuật điện tử - viễn thông",
      "Kỹ thuật điện",
      "Thiết kế vi mạch",

      // Song ngành
      "Song ngành: Kỹ thuật điện tử - viễn thông - Kỹ thuật điện",
      "Song ngành: Kỹ thuật điện tử - viễn thông - Kỹ thuật điều khiển và tự động hóa",
      "Song ngành: Kỹ thuật điện - Kỹ thuật điện tử - viễn thông",
      "Song ngành: Kỹ thuật điện - Kỹ thuật điều khiển và tự động hóa",
      "Song ngành: Kỹ thuật điều khiển và tự động hóa - Kỹ thuật điện tử - viễn thông",
      "Song ngành: Kỹ thuật điều khiển và tự động hóa - Kỹ thuật điện",
    ],
  },
  {
    name: "Khoa Kỹ thuật Giao thông",
    departments: [
      "Kỹ thuật hàng không",
      "Kỹ thuật ô tô",
      "Kỹ thuật tàu thủy",
      "Song ngành: Kỹ thuật tàu thủy - Hàng không",
    ],
  },
  {
    name: "Khoa Kỹ thuật Hóa học",
    departments: ["Công nghệ sinh học", "Kỹ thuật hóa học", "Công nghệ thực phẩm"],
  },
  {
    name: "Khoa Môi trường và Tài nguyên",
    departments: [
      "Kỹ thuật môi trường",
      "Quản lý tài nguyên và môi trường",
      "Kinh tế tài nguyên thiên nhiên",
    ],
  },
  {
    name: "Khoa Khoa học và Kỹ thuật Máy tính",
    departments: [
      "Khoa học máy tính",
      "Kỹ thuật máy tính",
      "Công nghệ thông tin (Vừa làm vừa học)",
    ],
  },
  {
    name: "Khoa Quản lý Công nghiệp",
    departments: ["Quản lý công nghiệp", "Quản trị kinh doanh"],
  },
  {
    name: "Khoa Khoa học Ứng dụng",
    departments: ["Cơ kỹ thuật", "Vật lý kỹ thuật", "Khoa học dữ liệu"],
  },
  {
    name: "Khoa Công nghệ Vật liệu",
    departments: ["Kỹ thuật vật liệu"],
  },
  {
    name: "Khoa Kỹ thuật Xây dựng",
    departments: [
      "Kỹ thuật công trình biển",
      "Kỹ thuật cơ sở hạ tầng",
      "Công nghệ kỹ thuật vật liệu xây dựng",
      "Kỹ thuật xây dựng",
      "Kiến trúc",
      "Kỹ thuật trắc địa - bản đồ",
      "Kỹ thuật xây dựng công trình thủy",
      "Kỹ thuật xây dựng công trình giao thông",
      "Kinh tế xây dựng",
    ],
  },
  {
    name: "Việt Pháp",
    departments: [
      "Kỹ thuật cơ điện tử",
      "Hàng không",
      "Vật liệu polymer và composite",
      "Vật liệu và năng lượng",
      "Viễn thông",
      "Hệ thống năng lượng điện",
      "Kỹ thuật và quản lý nước đô thị",
      "Xây dựng dân dụng - Công nghiệp và Hiệu quả",
    ],
  },
  {
    name: "Chương trình Tiên tiến",
    departments: [
      "Vi mạch - Hệ thống phần cứng",
      "Hệ thống năng lượng",
      "Kỹ thuật điều khiển và tự động hóa",
      "Hệ thống viễn thông",
    ],
  },
];

// Schema Validation
const profileSchema = z.object({
  name: z.string().min(2, "Tên quá ngắn"),
  phone: z.string().optional(),
  faculty: z.string().optional(), // Thêm trường ảo để chọn Khoa
  department: z.string().optional(), // Đây là trường lưu vào DB (Bộ môn)
  education: z.string().optional(),
  experience_years: z.string().optional(),
  bio: z.string().optional(),
  hourlyRate: z.preprocess(
    (val) => (val ? parseInt(val, 10) : 0),
    z.number().min(0, "Học phí không hợp lệ")
  ),
});

const fetchProfile = async (userId) => {
  return await axiosClient.get(`/tutor/${userId}/view`);
};

export function TutorProfile({ user }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const userId = user?.id || localStorage.getItem("userId");

  const [subjects, setSubjects] = useState([]);
  const [newSubjectInput, setNewSubjectInput] = useState("");

  const {
    data: fullData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tutorProfile", userId],
    queryFn: () => fetchProfile(userId),
    enabled: !!userId,
  });

  const profileData = fullData?.profileData;

  // --- 2. Setup Form với watch và setValue ---
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  // Theo dõi giá trị Khoa đang chọn
  const selectedFaculty = watch("faculty");

  // Tính toán danh sách Bộ môn dựa trên Khoa
  const availableDepartments = useMemo(() => {
    const faculty = FACULTY_DATA.find((f) => f.name === selectedFaculty);
    return faculty ? faculty.departments : [];
  }, [selectedFaculty]);

  // Reset form khi có dữ liệu
  useEffect(() => {
    if (profileData) {
      // Logic ngược: Từ Bộ môn (trong DB) -> Tìm ra Khoa để hiển thị default
      let foundFaculty = "";
      if (profileData.department) {
        const found = FACULTY_DATA.find((f) =>
          f.departments.includes(profileData.department)
        );
        if (found) foundFaculty = found.name;
      }

      reset({
        name: profileData.name || "",
        phone: profileData.phone || "",
        faculty: foundFaculty, // Set giá trị Khoa tìm được
        department: profileData.department || "",
        education: profileData.education || "",
        experience_years: profileData.experience_years || "",
        bio: profileData.bio || "",
        hourlyRate: profileData.hourly_rate || 0,
      });

      if (fullData.subjects && Array.isArray(fullData.subjects)) {
        setSubjects(fullData.subjects);
      }
    }
  }, [profileData, fullData, reset]);

  const handleAddSubject = () => {
    const val = newSubjectInput.trim();
    if (val && !subjects.includes(val)) {
      setSubjects([...subjects, val]);
      setNewSubjectInput("");
    } else if (subjects.includes(val)) {
      toast.warning("Môn học này đã có trong danh sách");
    }
  };

  const handleRemoveSubject = (subToRemove) => {
    setSubjects(subjects.filter((s) => s !== subToRemove));
  };

  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      if (!userId) throw new Error("Không tìm thấy User ID");

      const payload = {
        ...formData,
        user_id: userId,
        hourly_rate: formData.hourlyRate,
        subjects: subjects,
        // Lưu ý: Chúng ta chỉ gửi 'department' (Bộ môn) lên server,
        // 'faculty' chỉ là trường UI để filter.
      };
      return await axiosClient.put("/tutor/update-profile", payload);
    },
    onSuccess: () => {
      toast.success("Cập nhật hồ sơ thành công!");
      setIsEditing(false);
      queryClient.invalidateQueries(["tutorProfile", userId]);
    },
    onError: (err) => {
      console.error(err);
      toast.error(
        "Lỗi cập nhật: " + (err.response?.data?.error || err.message)
      );
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("avatar", file);
      return await axiosClient.post("/tutor/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Đổi ảnh đại diện thành công!");
      queryClient.invalidateQueries(["tutorProfile", userId]);
    },
    onError: (err) => {
      toast.error(
        "Lỗi upload ảnh: " + (err.response?.data?.message || err.message)
      );
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadAvatarMutation.mutate(file);
  };

  const onSubmit = (data) => updateMutation.mutate(data);

  if (isLoading)
    return <div className="p-10 text-center">Đang tải hồ sơ...</div>;
  if (isError)
    return (
      <div className="p-10 text-center text-red-500">Lỗi tải dữ liệu!</div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2">
              Hồ sơ cá nhân
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin hiển thị với sinh viên
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Thông tin cơ bản</CardTitle>
                <div className="ml-auto">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4 mr-2" /> Hủy
                      </Button>
                      <Button
                        className="bg-brand-gradient text-white"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="bg-brand-gradient text-white"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 mb-4 border-4 border-white shadow-lg">
                      <AvatarImage src={profileData?.avatarUrl} />
                      <AvatarFallback className="bg-[#A7C6ED] text-[#0388B4] text-3xl">
                        {profileData?.name?.charAt(0) || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadAvatarMutation.isPending}
                      >
                        <Upload className="h-4 w-4 mr-2" />{" "}
                        {uploadAvatarMutation.isPending
                          ? "Đang tải..."
                          : "Đổi ảnh"}
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Họ và tên</Label>
                      <Input disabled={!isEditing} {...register("name")} />
                      {errors.name && (
                        <span className="text-red-500 text-xs">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        disabled
                        value={profileData?.email}
                        className="bg-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Số điện thoại</Label>
                      <Input
                        disabled={!isEditing}
                        {...register("phone")}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    {/* --- CẬP NHẬT: Select Khoa --- */}
                    <div className="space-y-2">
                      <Label>Khoa</Label>
                      <select
                        disabled={!isEditing}
                        {...register("faculty", {
                          onChange: () => setValue("department", ""), // Reset bộ môn khi đổi khoa
                        })}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">-- Chọn Khoa --</option>
                        {FACULTY_DATA.map((fac) => (
                          <option key={fac.name} value={fac.name}>
                            {fac.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* --- CẬP NHẬT: Select Bộ môn (Phụ thuộc Khoa) --- */}
                  <div className="space-y-2">
                    <Label>Bộ môn</Label>
                    <select
                      disabled={!isEditing || !selectedFaculty}
                      {...register("department")}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100"
                    >
                      <option value="">-- Chọn Bộ môn --</option>
                      {availableDepartments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Trình độ học vấn</Label>
                    <Input
                      disabled={!isEditing}
                      {...register("education")}
                      placeholder="VD: Tiến sĩ, Thạc sĩ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kinh nghiệm</Label>
                    <Input
                      disabled={!isEditing}
                      {...register("experience_years")}
                      placeholder="VD: 10 năm"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label>Giới thiệu bản thân</Label>
                  <Textarea
                    disabled={!isEditing}
                    rows={4}
                    {...register("bio")}
                    placeholder="Mô tả ngắn về phương pháp dạy của bạn..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#F0F9FF] border-[#A7C6ED]">
              <CardHeader>
                <CardTitle className="text-[#0388B4]">
                  Thống kê hoạt động
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Đánh giá</span>
                  <div className="flex items-center gap-1 font-bold text-lg">
                    {profileData?.rating}{" "}
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Học viên</span>
                  <span className="font-bold">
                    {profileData?.totalStudents}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Buổi dạy hoàn thành</span>
                  <span className="font-bold">
                    {profileData?.completedSessions}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#0388B4]" />{" "}
                  <span>{profileData?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#0388B4]" />{" "}
                  <span>{profileData?.phone || "Chưa cập nhật"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#0388B4]" /> Môn học giảng
                  dạy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {subjects.length > 0 ? (
                    subjects.map((sub, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-[#E0F2FE] text-[#0388B4] text-sm py-1 px-3 flex items-center gap-1 hover:bg-blue-100"
                      >
                        {sub}
                        {isEditing && (
                          <XCircle
                            className="h-3 w-3 cursor-pointer hover:text-red-500 ml-1"
                            onClick={() => handleRemoveSubject(sub)}
                          />
                        )}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Chưa có môn học nào.</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2 max-w-sm mt-2">
                    <Input
                      placeholder="Nhập môn học (VD: Đại số)"
                      value={newSubjectInput}
                      onChange={(e) => setNewSubjectInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddSubject())
                      }
                    />
                    <Button
                      type="button"
                      onClick={handleAddSubject}
                      variant="outline"
                      className="border-dashed border-[#0388B4] text-[#0388B4]"
                    >
                      <Plus className="h-4 w-4" /> Thêm
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate("/tutor/availability")}
            >
              Cập nhật lịch rảnh
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}