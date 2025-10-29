// src/components/feedback/TutorFeedbackStats.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function TutorFeedbackStats({ stats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê đánh giá</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Điểm trung bình:</span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{stats.avgRating}</span>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tổng lượt đánh giá:</span>
            <span>{stats.totalFeedbacks}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Buổi học được đánh giá:</span>
            <span>{stats.ratedSessions}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
