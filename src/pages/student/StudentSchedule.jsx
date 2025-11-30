import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  FileText,
  Clock,
  MapPin,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";
import { Footer } from "../../components/layout/Footer";

// Cấu hình Moment tiếng Việt
moment.locale("vi");
const localizer = momentLocalizer(moment);

// Custom CSS
const customCalendarStyles = `
  .rbc-month-view { border-radius: 8px; background: white; border: 1px solid #e2e8f0; }
  .rbc-header { padding: 8px; font-weight: 600; color: #4a5568; background: #f7fafc; border-bottom: 1px solid #e2e8f0; }
  .rbc-today { background-color: #ebf8ff; }
  .rbc-event { background-color: transparent !important; padding: 0 !important; outline: none !important; }
  .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #e2e8f0; }
`;

// API Fetch
const fetchStudentSchedule = async () => {
  try {
    const res = await axiosClient.get("/sessions/my-schedule");

    // LOGIC AN TOÀN:
    // 1. Nếu axiosClient trả data trực tiếp (do interceptor) -> dùng res
    // 2. Nếu axiosClient trả response object -> dùng res.data
    // 3. Nếu không có gì -> trả về mảng rỗng []
    const data = Array.isArray(res) ? res : res?.data || [];

    return data;
  } catch (error) {
    console.error("Lỗi tải lịch học sinh viên:", error);
    return []; // ⚠️ QUAN TRỌNG: Trả về mảng rỗng thay vì để crash
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

// Event Component
const MoodleEvent = ({ event }) => {
  const isOnline = event.resource.mode === "online";
  const isCompleted = event.resource.status === "completed";

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

export function StudentSchedule({ user }) {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(null);

  const { data: schedule = [], isLoading } = useQuery({
    queryKey: ["studentSchedule"],
    queryFn: fetchStudentSchedule,
  });

  // Map Data
  // ✅ CẬP NHẬT LOGIC MAP DATA
  const events = useMemo(() => {
    return schedule
      .map((s) => {
        try {
          // Xử lý tương tự Tutor
          const startTimeStr = s.time ? s.time.split(" - ")[0] : "00:00";
          const start = new Date(`${s.date}T${startTimeStr}`);
          const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

          return {
            id: s.id,
            title: s.title, // VD: Giải tích 1 (Buổi 1)
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

  const handleEnterClass = () => {
    // Chuyển hướng đến trang Chi tiết khóa học
    if (selectedSession?.course_id) {
      navigate(`/courses/${selectedSession.course_id}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <style>{customCalendarStyles}</style>
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Thời Khóa Biểu
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

        {/* Modal Chi tiết */}
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
            <div className="py-2 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>
                  {selectedSession?.time} - {selectedSession?.date}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{selectedSession?.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-semibold text-gray-600">Hình thức:</div>
                <span className="uppercase font-bold text-[#3961c5]">
                  {selectedSession?.mode}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleEnterClass}
                className="bg-[#3961c5] text-white w-full"
              >
                {selectedSession?.mode === "online" ? (
                  <>
                    <Video className="w-4 h-4 mr-2" /> Vào phòng học
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" /> Xem tài liệu khóa học
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
