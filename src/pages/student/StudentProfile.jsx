import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { AddressSelector } from "../../components/ui/AddressSelector";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Footer } from "../../components/layout/Footer";
import { Edit, Upload, Save, X, Mail, Phone, MapPin } from "lucide-react";
import axiosClient from "../../api/axiosClient";

// --- 1. DỮ LIỆU KHOA - NGÀNH ---
const FACULTY_DATA = [
  {
    name: "Khoa Cơ khí",
    majors: [
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
    majors: ["Kỹ thuật địa chất", "Kỹ thuật dầu khí", "Địa kỹ thuật xây dựng"],
  },
  {
    name: "Khoa Điện - Điện tử",
    majors: [
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
    majors: [
      "Kỹ thuật hàng không",
      "Kỹ thuật ô tô",
      "Kỹ thuật tàu thủy",
      "Song ngành: Kỹ thuật tàu thủy - Hàng không",
    ],
  },
  {
    name: "Khoa Kỹ thuật Hóa học",
    majors: ["Công nghệ sinh học", "Kỹ thuật hóa học", "Công nghệ thực phẩm"],
  },
  {
    name: "Khoa Môi trường và Tài nguyên",
    majors: [
      "Kỹ thuật môi trường",
      "Quản lý tài nguyên và môi trường",
      "Kinh tế tài nguyên thiên nhiên",
    ],
  },
  {
    name: "Khoa Khoa học và Kỹ thuật Máy tính",
    majors: [
      "Khoa học máy tính",
      "Kỹ thuật máy tính",
      "Công nghệ thông tin (Vừa làm vừa học)",
    ],
  },
  {
    name: "Khoa Quản lý Công nghiệp",
    majors: ["Quản lý công nghiệp", "Quản trị kinh doanh"],
  },
  {
    name: "Khoa Khoa học Ứng dụng",
    majors: ["Cơ kỹ thuật", "Vật lý kỹ thuật", "Khoa học dữ liệu"],
  },
  {
    name: "Khoa Công nghệ Vật liệu",
    majors: ["Kỹ thuật vật liệu"],
  },
  {
    name: "Khoa Kỹ thuật Xây dựng",
    majors: [
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
    majors: [
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
    majors: [
      "Vi mạch - Hệ thống phần cứng",
      "Hệ thống năng lượng",
      "Kỹ thuật điều khiển và tự động hóa",
      "Hệ thống viễn thông",
    ],
  },
];


const fetchStudentProfile = async () => {
  return await axiosClient.get("/student/profile");
};

export function StudentProfile({ user }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const userId = user?.id || localStorage.getItem("userId");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["studentProfile", userId],
    queryFn: fetchStudentProfile,
    enabled: !!userId,
  });

  // --- 2. Thêm watch và setValue vào useForm ---
  const { register, handleSubmit, reset, control, watch, setValue } = useForm();

  // Theo dõi giá trị của ô "Khoa" theo thời gian thực
  const selectedFaculty = watch("faculty");

  // Tính toán danh sách ngành dựa trên khoa đang chọn
  const availableMajors = React.useMemo(() => {
    const faculty = FACULTY_DATA.find((f) => f.name === selectedFaculty);
    return faculty ? faculty.majors : [];
  }, [selectedFaculty]);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
        faculty: profile.faculty || "",
        major: profile.major || "",
        enrollmentYear: profile.enrollmentYear || "",
        address: profile.address || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return await axiosClient.put("/student/profile", data);
    },
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
      setIsEditing(false);
      queryClient.invalidateQueries(["studentProfile"]);
    },
    onError: () => toast.error("Lỗi cập nhật thông tin"),
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("avatar", file);
      return await axiosClient.post("/student/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Đổi ảnh đại diện thành công!");
      queryClient.invalidateQueries(["studentProfile"]);
      setTimeout(() => window.location.reload(), 1000);
    },
    onError: () => toast.error("Lỗi upload ảnh"),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadAvatarMutation.mutate(file);
  };

  const onSubmit = (data) => updateMutation.mutate(data);

  if (isLoading)
    return <div className="p-10 text-center">Đang tải hồ sơ...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
            <p className="text-gray-500">Quản lý thông tin hiển thị của bạn</p>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" /> Hủy
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={updateMutation.isPending}
                className="bg-brand-gradient text-white"
              >
                <Save className="h-4 w-4 mr-2" /> Lưu
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="border-[#0388B4] text-[#0388B4]"
            >
              <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Cột Trái (Giữ nguyên) */}
          <Card className="md:col-span-1 h-fit">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div
                className="relative group cursor-pointer"
                onClick={() => isEditing && fileInputRef.current?.click()}
              >
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg mb-4">
                  <AvatarImage
                    src={profile?.avatarUrl}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl bg-blue-100 text-blue-600">
                    {profile?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <Upload className="text-white h-8 w-8" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {profile?.name}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
                <Mail className="h-3 w-3" /> {profile?.email}
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Phone className="h-3 w-3" />{" "}
                {profile?.phone || "Chưa cập nhật SĐT"}
              </div>
            </CardContent>
          </Card>

          {/* Cột Phải */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Họ và tên</Label>
                  <Input disabled={!isEditing} {...register("name")} />
                </div>
                <div className="space-y-2">
                  <Label>MSSV</Label>
                  <Input
                    disabled
                    value={profile?.mssv || "Chưa cập nhật"}
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input
                    disabled={!isEditing}
                    {...register("phone")}
                    placeholder="09..."
                  />
                </div>

                {/* --- 3. KHOA (Dạng Select) --- */}
                <div className="space-y-2">
                  <Label>Khoa</Label>
                  <select
                    disabled={!isEditing}
                    {...register("faculty", {
                      onChange: () => setValue("major", ""), // Reset ngành khi đổi khoa
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

              <div className="grid grid-cols-2 gap-4">
                {/* --- 4. NGÀNH (Dạng Select phụ thuộc Khoa) --- */}
                <div className="space-y-2">
                  <Label>Ngành</Label>
                  <select
                    disabled={!isEditing || !selectedFaculty}
                    {...register("major")}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100"
                  >
                    <option value="">-- Chọn Ngành --</option>
                    {availableMajors.map((major) => (
                      <option key={major} value={major}>
                        {major}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Năm nhập học</Label>
                  <Input
                    disabled={!isEditing}
                    {...register("enrollmentYear")}
                    placeholder="VD: 2022"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Địa chỉ liên hệ
                </Label>
                {isEditing ? (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <Controller
                      control={control}
                      name="address"
                      render={({ field: { onChange, value } }) => (
                        <AddressSelector
                          value={value}
                          onChange={onChange}
                          disabled={false}
                        />
                      )}
                    />
                  </div>
                ) : (
                  <div className="p-2 bg-gray-100 rounded text-gray-700 text-sm min-h-[40px] flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {profile?.address || "Chưa cập nhật địa chỉ"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Giới thiệu bản thân</Label>
                <Textarea
                  disabled={!isEditing}
                  rows={3}
                  {...register("bio")}
                  placeholder="..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
