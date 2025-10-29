// src/components/ui/StatusBadge.jsx
import { Badge } from "@/components/ui/badge";
const MAP = {
  confirmed: { text: "Đã xác nhận", cls: "bg-green-100 text-green-800" },
  pending: { text: "Chờ xác nhận", cls: "bg-yellow-100 text-yellow-800" },
  cancelled: { text: "Đã hủy", cls: "bg-red-100 text-red-800" },
  completed: { text: "Hoàn thành", cls: "bg-blue-100 text-blue-800" },
  high: { text: "Ưu tiên cao", cls: "bg-red-100 text-red-800" },
  medium: { text: "Trung bình", cls: "bg-yellow-100 text-yellow-800" },
  low: { text: "Thấp", cls: "bg-blue-100 text-blue-800" },
};
export default function StatusBadge({ status }) {
  const s = MAP[status] || { text: status, cls: "bg-gray-100 text-gray-800" };
  return <Badge className={s.cls}>{s.text}</Badge>;
}
