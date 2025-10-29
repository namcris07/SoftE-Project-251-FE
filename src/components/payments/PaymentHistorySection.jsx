import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function PaymentHistorySection({ paymentHistory }) {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5 text-[#0388B4]" />
            <span>Lịch sử thanh toán</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentHistory.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      t.status === "completed"
                        ? "bg-green-100"
                        : t.status === "failed"
                        ? "bg-red-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    {t.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : t.status === "failed" ? (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{t.subject}</p>
                    <p className="text-sm text-gray-600">{t.tutor}</p>
                    <p className="text-xs text-gray-500">
                      {t.date} • {t.method} • {t.transactionId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {t.amount.toLocaleString("vi-VN")} ₫
                  </p>
                  <Badge
                    className={
                      t.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : t.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {t.status === "completed"
                      ? "Thành công"
                      : t.status === "failed"
                      ? "Thất bại"
                      : "Đang xử lý"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
