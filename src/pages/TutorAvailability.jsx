import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, Plus, X, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { tutorScheduleAPI } from "../mock/mockAPI";
const DAYS_OF_WEEK = [
  { value: "monday", label: "Thứ Hai" },
  { value: "tuesday", label: "Thứ Ba" },
  { value: "wednesday", label: "Thứ Tư" },
  { value: "thursday", label: "Thứ Năm" },
  { value: "friday", label: "Thứ Sáu" },
  { value: "saturday", label: "Thứ Bảy" },
  { value: "sunday", label: "Chủ Nhật" },
];

const TIME_SLOTS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

export function TutorAvailability({ user, onNavigate }) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Form state for new slot
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    location: "H1-101",
  });

  useEffect(() => {
    loadAvailableSlots();
  }, [user?.id]);

  const loadAvailableSlots = async () => {
    setLoading(true);
    try {
      const slots = await tutorScheduleAPI.getAvailableSlots(user.id);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error loading available slots:", error);
      toast.error("Không thể tải lịch rảnh");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async () => {
    if (!newSlot.dayOfWeek || !newSlot.startTime || !newSlot.endTime) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await tutorScheduleAPI.addAvailableSlot(user.id, newSlot);
      toast.success("Đã thêm khung giờ rảnh");
      setIsDialogOpen(false);
      setNewSlot({
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        location: "H1-101",
      });
      loadAvailableSlots();
    } catch (error) {
      console.error("Error adding slot:", error);
      toast.error("Có lỗi khi thêm khung giờ rảnh");
    }
  };

  const handleRemoveSlot = async (slotId) => {
    try {
      await tutorScheduleAPI.removeAvailableSlot(slotId);
      toast.success("Đã xóa khung giờ rảnh");
      loadAvailableSlots();
    } catch (error) {
      console.error("Error removing slot:", error);
      toast.error("Có lỗi khi xóa khung giờ rảnh");
    }
  };

  // Group slots by day
  const slotsByDay = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.dayOfWeek]) acc[slot.dayOfWeek] = [];
    acc[slot.dayOfWeek].push(slot);
    return acc;
  }, {});

  const getDayLabel = (dayValue) => {
    return DAYS_OF_WEEK.find((d) => d.value === dayValue)?.label || dayValue;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2">
              Quản lý lịch rảnh
            </h1>
            <p className="text-gray-600">
              Thiết lập các khung giờ bạn có thể nhận lịch dạy
            </p>
          </div>

          {/* Dialog thêm khung giờ */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-brand-gradient text-white">
                <Plus className="h-4 w-4 mr-2" />
                Thêm khung giờ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm khung giờ rảnh</DialogTitle>
                <DialogDescription>
                  Thêm các khung giờ bạn có thể nhận lịch dạy
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Ngày trong tuần</Label>
                  <Select
                    value={newSlot.dayOfWeek}
                    onValueChange={(value) =>
                      setNewSlot({ ...newSlot, dayOfWeek: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngày" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Giờ bắt đầu</Label>
                    <Select
                      value={newSlot.startTime}
                      onValueChange={(value) =>
                        setNewSlot({ ...newSlot, startTime: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Giờ kết thúc</Label>
                    <Select
                      value={newSlot.endTime}
                      onValueChange={(value) =>
                        setNewSlot({ ...newSlot, endTime: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Địa điểm</Label>
                  <Input
                    value={newSlot.location}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, location: e.target.value })
                    }
                    placeholder="VD: H1-101 hoặc Online"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleAddSlot}
                  className="bg-brand-gradient"
                >
                  Thêm
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Weekly Schedule View */}
      <div className="grid gap-4">
        {DAYS_OF_WEEK.map((day) => (
          <Card key={day.value}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#3961c5]" />
                <span>{day.label}</span>
                {slotsByDay[day.value] && (
                  <Badge variant="secondary" className="ml-2">
                    {slotsByDay[day.value].length} khung giờ
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!slotsByDay[day.value] || slotsByDay[day.value].length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Chưa có khung giờ rảnh
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {slotsByDay[day.value].map((slot) => (
                    <div
                      key={slot.id}
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow relative"
                    >
                      <button
                        onClick={() => handleRemoveSlot(slot.id)}
                        className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-full text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-[#3961c5]" />
                        <span className="font-medium">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{slot.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
