import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import { Footer } from "../../components/layout/Footer";

// Cấu hình Moment tiếng Việt
moment.locale("vi");
const localizer = momentLocalizer(moment);

// Custom CSS cho lịch
const customCalendarStyles = `
  .rbc-month-view { border-radius: 8px; background: white; border: 1px solid #e2e8f0; }
  .rbc-header { padding: 8px; font-weight: 600; color: #4a5568; background: #f7fafc; border-bottom: 1px solid #e2e8f0; }
  .rbc-today { background-color: #ebf8ff; }
  .rbc-event { background-color: transparent !important; padding: 0 !important; outline: none !important; }
  .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #e2e8f0; }
`;

// API Fetch
const fetchTutorSchedule = async () => {
  try {
    // Gọi API
    const res = await axiosClient.get("/sessions");

    // LOGIC AN TOÀN:
    // 1. Nếu axiosClient đã cấu hình interceptor trả về data trực tiếp -> dùng res
    // 2. Nếu axiosClient trả về response object chuẩn -> dùng res.data
    // 3. Nếu cả 2 đều null/undefined -> trả về mảng rỗng [] để tránh crash React Query
    const data = Array.isArray(res) ? res : res?.data || [];

    return data;
  } catch (error) {
    console.error("Lỗi tải lịch dạy:", error);
    return []; // Trả về mảng rỗng nếu API lỗi, không được trả về undefined
  }
};

// Toolbar Component
const MoodleToolbar = (toolbar) => {
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const date = moment(toolbar.date);
  return (
    <div className="flex items-center justify-between mb-4 text-[#0f6cbf]">
      <div
        onClick={goToBack}
        className="cursor-pointer font-bold flex items-center hover:underline"
      >
        <ChevronLeft className="w-5 h-5" /> Tháng trước
      </div>
      <div className="text-xl font-bold uppercase">
        Tháng {date.format("MM / YYYY")}
      </div>
      <div
        onClick={goToNext}
        className="cursor-pointer font-bold flex items-center hover:underline"
      >
        Tháng sau <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};

// Event Component (Chấm tròn)
const MoodleEvent = ({ event }) => {
  const isCompleted = event.resource.status === "completed";
  const isOnline = event.resource.mode === "online";

  return (
    <div className="flex items-center gap-1.5 px-1 py-0.5 cursor-pointer hover:bg-gray-100 rounded transition-colors">
      <div
        className={`w-2.5 h-2.5 rounded-full border-2 bg-white flex-shrink-0 ${
          isCompleted
            ? "border-gray-400"
            : isOnline
            ? "border-green-500"
            : "border-blue-600"
        }`}
      ></div>
      <span
        className={`text-xs truncate font-medium ${
          isCompleted ? "text-gray-500 line-through" : "text-gray-700"
        }`}
      >
        {event.title}
      </span>
    </div>
  );
};

export function TutorSchedule() {
  const [selectedSession, setSelectedSession] = useState(null);

  const { data: schedule = [], isLoading } = useQuery({
    queryKey: ["tutorSchedule"],
    queryFn: fetchTutorSchedule,
  });

  // Map Data từ BE sang format React-Big-Calendar
  // ✅ CẬP NHẬT LOGIC MAP DATA
  const events = useMemo(() => {
    return schedule
      .map((s) => {
        try {
          // s.time có dạng "08:00 - 10:00"
          // Lấy giờ bắt đầu "08:00"
          const startTimeStr = s.time ? s.time.split(" - ")[0] : "00:00";

          // Tạo Date object chuẩn
          const start = new Date(`${s.date}T${startTimeStr}`);

          // Tạo End Date (mặc định +2 tiếng nếu không tính toán kỹ, hoặc lấy từ chuỗi end time)
          // Cách đơn giản: lấy start + 2 tiếng
          const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

          return {
            id: s.id,
            title: `${s.title} (${s.courseName || "Lớp học"})`, // Hiển thị rõ tên lớp
            start: start,
            end: end,
            resource: s,
          };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);
  }, [schedule]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <style>{customCalendarStyles}</style>
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Lịch Dạy Của Tôi
        </h1>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 750 }}
              components={{ toolbar: MoodleToolbar, event: MoodleEvent }}
              views={["month"]}
              defaultView="month"
              popup
              onSelectEvent={(e) => setSelectedSession(e.resource)}
            />
          </div>
        )}

        {/* Popup Chi Tiết Buổi Dạy */}
        <Dialog
          open={!!selectedSession}
          onOpenChange={() => setSelectedSession(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#3961c5]">
                {selectedSession?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>
                  {selectedSession?.time} - {selectedSession?.date}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{selectedSession?.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Users className="w-5 h-5 text-gray-400" />
                <span>Sĩ số: {selectedSession?.current_students || 0} SV</span>
              </div>

              <Button className="w-full bg-[#3961c5] text-white mt-4">
                Vào lớp / Điểm danh
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
