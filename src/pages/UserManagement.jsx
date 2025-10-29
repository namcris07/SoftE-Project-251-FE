import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export function UserManagement({ user }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🟦 Lấy danh sách user từ backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🟩 Tạo người dùng mới
  const handleAddUser = async () => {
    const role = prompt("Nhập vai trò (admin/tutor/student):", "student");
    const email = prompt("Nhập email người dùng mới:");
    const full_name = prompt("Nhập họ tên:");
    const password = prompt("Nhập mật khẩu (tối thiểu 6 ký tự):");
    
    if (!email || !password) return toast.warning("Thiếu email hoặc mật khẩu!");

    try {
      const res = await fetch("http://localhost:3000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role, email, full_name, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("✅ Tạo tài khoản thành công!");
      fetchUsers();
    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      toast.error("Lỗi khi tạo tài khoản: " + err.message);
    }

  };

  // 🟨 Sửa thông tin user
  const handleEditUser = async (u) => {
    const newEmail = prompt("Nhập email mới:", u.email);
    const newName = prompt("Nhập tên mới:", u.full_name);
    const newPass = prompt("Đặt lại mật khẩu (để trống nếu không đổi):");

    try {
      const res = await fetch(`http://localhost:3000/api/admin/users/${u.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newEmail,
          full_name: newName,
          password: newPass || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("✅ Cập nhật thành công!");
      fetchUsers();
    } catch (err) {
      toast.error("Lỗi khi cập nhật: " + err.message);
    }
  };

  // 🟥 Xóa người dùng
  const handleDeleteUser = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này không?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("🗑️ Xóa thành công!");
      fetchUsers();
    } catch (err) {
      toast.error("Không thể xóa: " + err.message);
    }
  };

  // 🧩 Lọc danh sách user
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#0388B4]">
          👥 Quản lý người dùng
        </h1>
        <Button className="bg-[#0388B4] text-white" onClick={handleAddUser}>
          <Plus className="h-4 w-4 mr-2" /> Thêm người dùng
        </Button>
      </div>

      {/* Bộ lọc */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="tutor">Tutor</option>
          <option value="student">Student</option>
        </select>
      </div>

      {/* Danh sách người dùng */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Đang tải...</p>
          ) : filteredUsers.length === 0 ? (
            <p>Không có người dùng nào.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Họ và tên</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Vai trò</th>
                  <th className="p-2 text-left">Ngày tạo</th>
                  <th className="p-2 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="p-2">{u.id}</td>
                    <td className="p-2">{u.full_name || "—"}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2 capitalize">{u.role || "student"}</td>
                    <td className="p-2">
                      {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-2 flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#0388B4] border-[#0388B4]"
                        onClick={() => handleEditUser(u)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
