import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useCalendarStore } from "@/store/useCalendarStore";
import {
  formatDate,
  getWeekdayName,
  isToday,
  isWeekend,
} from "@/utils/calendarFilter";

export default function CalendarStrip() {
  const { weekDates, selectedDate, setSelectedDate } = useCalendarStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 120;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm border-b border-orange-100/80">
      <div className="container py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex w-8 h-8 rounded-full items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"
            aria-label="向左滚动"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {weekDates.map((date) => {
              const dateStr = formatDate(date);
              const isSelected = selectedDate === dateStr;
              const isTodayDate = isToday(date);
              const isWeekendDate = isWeekend(date);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`
                    shrink-0 w-16 py-2 rounded-xl flex flex-col items-center transition-all duration-300
                    ${
                      isSelected
                        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-105"
                        : isTodayDate
                        ? "border-2 border-primary-400 bg-primary-50 text-primary-700"
                        : "bg-gray-50/80 text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <span
                    className={`text-xs font-medium ${
                      isSelected
                        ? "text-primary-100"
                        : isWeekendDate
                        ? "text-warn-500"
                        : "text-gray-400"
                    }`}
                  >
                    {getWeekdayName(date)}
                  </span>
                  <span
                    className={`text-lg font-bold mt-0.5 ${
                      isSelected ? "text-white" : ""
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  {isTodayDate && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            className="hidden md:flex w-8 h-8 rounded-full items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"
            aria-label="向右滚动"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
