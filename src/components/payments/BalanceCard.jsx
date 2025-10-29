import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BalanceCard({ balance }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Số dư tài khoản</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#0388B4] mb-2">
            {balance.toLocaleString("vi-VN")} ₫
          </div>
          <p className="text-sm text-gray-600 mb-4">Số dư khả dụng</p>
          <Button
            variant="outline"
            className="w-full border-[#0388B4] text-[#0388B4]"
          >
            Xem chi tiết giao dịch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
