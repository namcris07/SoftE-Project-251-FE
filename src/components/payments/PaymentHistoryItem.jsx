import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaymentHistoryItem({ record }) {
  const statusMap = {
    success: { text: "Thành công", color: "bg-green-100 text-green-800" },
    failed: { text: "Thất bại", color: "bg-red-100 text-red-800" },
    pending: { text: "Đang xử lý", color: "bg-yellow-100 text-yellow-800" },
  };

  return (
    <Card>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-800">{record.title}</h3>
          <p className="text-gray-500 text-sm">{record.date}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-700 font-semibold">
            {record.amount.toLocaleString()}đ
          </p>
          <Badge className={statusMap[record.status]?.color}>
            {statusMap[record.status]?.text || record.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
