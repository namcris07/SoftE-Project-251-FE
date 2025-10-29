// src/components/feedback/FeedbackHistoryItem.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function FeedbackHistoryItem({ feedback }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="border-l-4 border-[#0388B4] pl-4">
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium">{feedback.subject}</div>
            <div className="text-sm text-gray-500">{feedback.date}</div>
          </div>
          <div className="flex items-center mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < feedback.rating
                    ? "text-yellow-500 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-700 text-sm">{feedback.comment}</p>
          <p className="text-xs text-gray-500 mt-1">
            Học viên: {feedback.student}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
