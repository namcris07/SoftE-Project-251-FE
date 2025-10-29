// src/components/feedback/PendingFeedbackCard.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RatingStars from "./RatingStars";
import { MessageSquare } from "lucide-react";

export default function PendingFeedbackCard({
  session,
  rating,
  onRate,
  comment,
  onComment,
  onSubmit,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-[#0388B4]" />
          <span>Đánh giá buổi học</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between mb-2">
            <div>
              <h3 className="font-medium">{session.subject}</h3>
              <p className="text-sm text-gray-600">Gia sư: {session.tutor}</p>
              <p className="text-sm text-gray-500">
                {session.date} • {session.duration}
              </p>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800">
              Chờ đánh giá
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <Label>Đánh giá chất lượng buổi học</Label>
              <RatingStars value={rating} onChange={onRate} size={22} />
            </div>

            <div>
              <Label>Nhận xét</Label>
              <Textarea
                rows={3}
                placeholder="Chia sẻ trải nghiệm của bạn..."
                value={comment}
                onChange={(e) => onComment(e.target.value)}
              />
            </div>

            <Button
              className="bg-[#0388B4] text-white"
              disabled={!rating}
              onClick={onSubmit}
            >
              Gửi đánh giá
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
