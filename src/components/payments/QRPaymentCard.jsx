import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { QrCode } from "lucide-react";

export default function QRPaymentCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="h-5 w-5 text-[#0388B4]" />
          <span>Thanh toán QR</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <QrCode className="h-16 w-16 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">
            Quét mã QR để thanh toán nhanh
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
