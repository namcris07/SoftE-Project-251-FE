// src/components/feedback/RatingStars.jsx
import { Star } from "lucide-react";

export default function RatingStars({
  value = 0,
  size = 16,
  onChange,
  max = 5,
}) {
  const stars = Array.from({ length: max });
  return (
    <div className="flex space-x-1">
      {stars.map((_, i) => {
        const idx = i + 1;
        const filled = idx <= value;
        const C = (
          <Star
            key={i}
            className={`h-[${size}px] w-[${size}px] ${
              filled ? "text-yellow-500 fill-current" : "text-gray-300"
            }`}
          />
        );
        return onChange ? (
          <button key={i} onClick={() => onChange(idx)}>
            {C}
          </button>
        ) : (
          C
        );
      })}
    </div>
  );
}
