import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ScholarshipInfoCard({ scholarship }) {
  if (!scholarship?.available) return null;

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          <span>Học bổng có sẵn</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-green-700 mb-2">
          Bạn có thể sử dụng học bổng với mức giảm {scholarship.discount}% cho
          các môn học đủ điều kiện.
        </p>
        <p className="text-sm text-green-600">
          Số tiền còn lại: {scholarship.remainingAmount.toLocaleString("vi-VN")}{" "}
          ₫
        </p>
        <div className="mt-2">
          <p className="text-sm font-medium text-green-800">Môn học áp dụng:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {scholarship.eligibleSubjects.map((subject) => (
              <Badge key={subject} className="bg-green-100 text-green-800">
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
