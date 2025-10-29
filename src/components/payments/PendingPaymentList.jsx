import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PendingPaymentList({
  pendingPayments,
  scholarshipInfo,
  paymentMethods,
  selectedMethod,
  onMethodChange,
  onPay,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-[#0388B4]" />
          <span>Thanh toán chờ xử lý</span>
          <Badge className="bg-red-100 text-red-800">
            {pendingPayments.length} chờ thanh toán
          </Badge>
        </CardTitle>
        <CardDescription>
          Các khoản thanh toán cần được hoàn tất
        </CardDescription>
      </CardHeader>

      <CardContent>
        {pendingPayments.length > 0 ? (
          <div className="space-y-4">
            {pendingPayments.map((payment) => (
              <div
                key={payment.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{payment.subject}</h3>
                    <p className="text-sm text-gray-600">
                      Gia sư: {payment.tutor}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.sessions} buổi học • Hạn: {payment.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lg text-[#0388B4]">
                      {payment.amount.toLocaleString("vi-VN")} ₫
                    </p>
                    {scholarshipInfo.available &&
                      scholarshipInfo.eligibleSubjects.includes(
                        payment.subject
                      ) && (
                        <p className="text-sm text-green-600">
                          Sau giảm:{" "}
                          {(
                            (payment.amount *
                              (100 - scholarshipInfo.discount)) /
                            100
                          ).toLocaleString("vi-VN")}{" "}
                          ₫
                        </p>
                      )}
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">
                      Phương thức thanh toán
                    </Label>
                    <Select
                      value={selectedMethod}
                      onValueChange={onMethodChange}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Chọn phương thức" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            <div className="flex items-center space-x-2">
                              <img
                                src={method.icon}
                                alt={method.name}
                                className="w-5 h-5 object-contain rounded-sm"
                              />
                              <span>{method.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onPay(payment.id)}
                      className="bg-[#0388B4] hover:bg-[#2851b4] text-white"
                      disabled={!selectedMethod}
                    >
                      Thanh toán ngay
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#0388B4] text-[#0388B4]"
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Không có khoản thanh toán chờ xử lý</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
