import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import axiosClient from "../../api/axiosClient";

// 1. Validation Schema
const userSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  full_name: z.string().min(2, "Tên quá ngắn"),
  role: z.enum(["admin", "tutor", "student"]),
  password: z.string().optional(),
});

// 2. API Calls
const fetchUsers = async () => {
  return await axiosClient.get("/users");
};

// ✅ SỬA LỖI: Dùng export function (Named Export) thay vì export default
export function UserManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form Setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { role: "student" },
  });

  // 3. Fetch Users Hook
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: fetchUsers,
  });

  // 4. Mutations
  const saveUserMutation = useMutation({
    mutationFn: async (formData) => {
      // Nếu password rỗng thì xóa khỏi payload để không bị hash chuỗi rỗng
      if (!formData.password) delete formData.password;

      if (editingUser) {
        return await axiosClient.put(`/users/${editingUser.id}`, formData);
      } else {
        return await axiosClient.post("/users", formData);
      }
    },
    onSuccess: () => {
      toast.success(
        editingUser ? "Cập nhật thành công!" : "Tạo người dùng mới thành công!"
      );
      setIsDialogOpen(false);
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        error.response?.data?.message || error.message || "Có lỗi xảy ra"
      );
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosClient.delete(`/users/${id}`);
    },
    onSuccess: () => {
      toast.success("Đã xóa người dùng!");
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Không thể xóa người dùng");
    },
  });

  // Handlers
  const openCreate = () => {
    setEditingUser(null);
    reset({ email: "", full_name: "", role: "student", password: "" });
    setValue("role", "student");
    setIsDialogOpen(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    // Reset form với dữ liệu user hiện tại
    reset({
      email: u.email,
      full_name: u.full_name,
      role: u.role,
      password: "",
    });
    setValue("role", u.role);
    setIsDialogOpen(true);
  };

  const onSubmit = (data) => {
    saveUserMutation.mutate(data);
  };

  // Client-side filtering
  const filteredUsers = users.filter((u) => {
    const name = u.full_name || "";
    const email = u.email || "";
    const matchSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-6 container mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="text-gray-500">
            Quản lý tài khoản Student, Tutor và Admin
          </p>
        </div>
        <Button className="bg-brand-gradient text-white" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Thêm người dùng
        </Button>
      </div>

      {/* Bộ lọc */}
      <Card className="mb-6">
        <CardContent className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên, email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="tutor">Tutor</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bảng danh sách */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 border-b">
                <tr>
                  <th className="p-4">Họ và tên</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4">Ngày tạo</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Không tìm thấy kết quả.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-medium">{u.full_name}</td>
                      <td className="p-4 text-gray-600">{u.email}</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={`uppercase text-xs ${
                            u.role === "admin"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : u.role === "tutor"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }`}
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-gray-500">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(u)}
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (
                              confirm(
                                `Bạn có chắc muốn xóa người dùng ${u.email}?`
                              )
                            )
                              deleteUserMutation.mutate(u.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Create/Edit User */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Chỉnh sửa thông tin" : "Thêm người dùng mới"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Cập nhật thông tin chi tiết cho người dùng này."
                : "Nhập thông tin cần thiết để tạo tài khoản mới."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <Input {...register("full_name")} placeholder="Nguyễn Văn A" />
              {errors.full_name && (
                <span className="text-red-500 text-xs">
                  {errors.full_name.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                {...register("email")}
                disabled={!!editingUser}
                placeholder="email@example.com"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("role")}
              >
                <option value="student">Sinh viên (Student)</option>
                <option value="tutor">Gia sư (Tutor)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>
                Mật khẩu {editingUser && "(Để trống nếu không đổi)"}
              </Label>
              <Input
                type="password"
                {...register("password")}
                placeholder="••••••"
              />
              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              className="bg-brand-gradient text-white"
              onClick={handleSubmit(onSubmit)}
              disabled={saveUserMutation.isPending}
            >
              {saveUserMutation.isPending
                ? "Đang xử lý..."
                : editingUser
                ? "Cập nhật"
                : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
