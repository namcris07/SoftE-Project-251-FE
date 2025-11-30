import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Calendar, Clock, Plus, Trash2, MapPin } from "lucide-react";
import { Footer } from "../../components/layout/Footer";
import axiosClient from "../../api/axiosClient";

const DAYS = [
  { val: "monday", label: "Thứ Hai" },
  { val: "tuesday", label: "Thứ Ba" },
  { val: "wednesday", label: "Thứ Tư" },
  { val: "thursday", label: "Thứ Năm" },
  { val: "friday", label: "Thứ Sáu" },
  { val: "saturday", label: "Thứ Bảy" },
  { val: "sunday", label: "Chủ Nhật" },
];

const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => `${i + 7}:00`);

const fetchAvailability = async () => {
  return await axiosClient.get("/sessions/availability");
};

export function TutorAvailability({ user }) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day: "",
    start: "",
    end: "",
    location: "Online",
  });

  // ✅ SỬA LOGIC LẤY ID: Nếu prop user null thì lấy từ LocalStorage
  const userId = user?.id || localStorage.getItem("userId");

  // 1. Fetch Data
  const { data: slots = [], isLoading } = useQuery({
    queryKey: ["availability"],
    queryFn: fetchAvailability,
    // ✅ QUAN TRỌNG: Chỉ chạy khi có userId (từ prop hoặc storage)
    enabled: !!userId,
  });

  console.log("👉 Frontend nhận Slots:", slots);

  // 2. Mutation: Thêm slot
  const addSlotMutation = useMutation({
    mutationFn: async (slotData) => {
      return await axiosClient.post("/sessions/availability", slotData);
    },
    onSuccess: (data) => {
      toast.success("Đã thêm khung giờ mới!");
      setIsDialogOpen(false);
      setNewSlot({ day: "", start: "", end: "", location: "Online" });

      // ✅ Invalidate đúng key để tự động refresh
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Lỗi thêm khung giờ");
    },
  });

  // 3. Mutation: Xóa slot
  const deleteSlotMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosClient.delete(`/sessions/availability/${id}`);
    },
    onSuccess: () => {
      toast.success("Đã xóa khung giờ.");
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });

  const handleAdd = () => {
    if (!newSlot.day || !newSlot.start || !newSlot.end) {
      return toast.error("Vui lòng chọn đầy đủ thông tin!");
    }
    if (parseInt(newSlot.start) >= parseInt(newSlot.end)) {
      return toast.error("Giờ kết thúc phải sau giờ bắt đầu!");
    }
    addSlotMutation.mutate(newSlot);
  };

  // Group slots by day for UI
  const slotsByDay = DAYS.reduce((acc, day) => {
    // So sánh không phân biệt hoa thường
    acc[day.val] = slots.filter(
      (s) => s.day?.toLowerCase() === day.val.toLowerCase()
    );
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2">
              Quản lý lịch rảnh
            </h1>
            <p className="text-gray-600">
              Đăng ký các khung giờ bạn có thể nhận lớp
            </p>
          </div>
          <Button
            className="bg-brand-gradient text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Thêm khung giờ
          </Button>
        </div>

        {/* Debug ID */}
        {!userId && (
          <div className="text-red-500 mb-4">
            Lỗi: Không tìm thấy User ID. Vui lòng đăng nhập lại.
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-10">Đang tải lịch...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DAYS.map((day) => (
              <Card
                key={day.val}
                className={`h-full ${
                  slotsByDay[day.val]?.length > 0
                    ? "border-[#A7C6ED] bg-blue-50/30"
                    : "bg-gray-50 border-dashed"
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-4 w-4 text-[#0388B4]" /> {day.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {slotsByDay[day.val]?.length === 0 ? (
                    <p className="text-xs text-gray-400 italic text-center py-4">
                      Trống
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {slotsByDay[day.val]?.map((slot) => (
                        <div
                          key={slot.id}
                          className="bg-white border rounded p-2 shadow-sm relative group"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Clock className="h-3 w-3" /> {slot.start} -{" "}
                            {slot.end}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3" /> {slot.location}
                          </div>

                          <button
                            className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteSlotMutation.mutate(slot.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog giữ nguyên như cũ */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm khung giờ rảnh</DialogTitle>
              <DialogDescription>
                Chọn thời gian bạn có thể giảng dạy
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Ngày trong tuần</Label>
                <Select
                  onValueChange={(v) => setNewSlot({ ...newSlot, day: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ngày" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((d) => (
                      <SelectItem key={d.val} value={d.val}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bắt đầu</Label>
                  <Select
                    onValueChange={(v) => setNewSlot({ ...newSlot, start: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="08:00" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Kết thúc</Label>
                  <Select
                    onValueChange={(v) => setNewSlot({ ...newSlot, end: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="10:00" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Địa điểm (Phòng học / Online)</Label>
                <Input
                  placeholder="VD: H1-201 hoặc Online"
                  value={newSlot.location}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, location: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button
                className="bg-brand-gradient text-white"
                onClick={handleAdd}
                disabled={addSlotMutation.isPending}
              >
                {addSlotMutation.isPending ? "Đang lưu..." : "Xác nhận"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
