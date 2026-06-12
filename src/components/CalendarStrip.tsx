import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useCalendarStore } from "@/store/useCalendarStore";
import {
  formatDate,
  getWeekdayName,
  isToday,
  isWeekend,
  getMonthLabel,
} from "@/utils/calendarFilter";

export default function CalendarStrip() {
  const { selectedDate, setSelectedDate, resetToToday, extendedDates, viewMode, setViewMode } = useCalendarStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayStr = formatDate(new Date());
  const isSelectedToday = selectedDate === todayStr;

  const weekGroups = useMemo(() => {
    const groups: { monthLabel: string; weekStart: Date; dates: Date[] }[] = [];
    for (let i = 0; i < extendedDates.length; i += 7) {
      const week = extendedDates.slice(i, i + 7);
      if (week.length > 0) {
        groups.push({
          monthLabel: getMonthLabel(week[0]),
          weekStart: week[0],
          dates: week,
        });
      }
    }
    return groups;
  }, [extendedDates]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current.querySelector<HTMLElement>(
      `[data-date="${selectedDate}"]`
    );
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedDate]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm border-b border-orange-100/80 sticky top-[88px] md:top-[100px] z-20">
      <div className="container py-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="ml-auto flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("all")}
              className={`
                px-3 py-1 text-xs font-medium rounded-md transition-all
                ${viewMode === "all" ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}
              `}
            >
              全部楼栋
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`
                px-3 py-1 text-xs font-medium rounded-md transition-all
                ${viewMode === "day" ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}
              `}
            >
              仅当日
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"
            aria-label="向左滚动"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto flex-1 scrollbar-hide py-1 px-0.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {weekGroups.map((group, gi) => (
              <div key={gi} className="flex shrink-0">
                <div className="flex flex-col justify-center items-center mr-2 pr-2 border-r border-gray-100">
                  <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                    {group.monthLabel}
                  </span>
                  <span className="text-[9px] text-gray-300 mt-0.5">第{gi + 1}周</span>
                </div>
                <div className="flex gap-1.5">
                  {group.dates.map((date) => {
                    const dateStr = formatDate(date);
                    const isSelected = selectedDate === dateStr;
                    const isTodayDate = isToday(date);
                    const isWeekendDate = isWeekend(date);

                    return (
                      <button
                        key={dateStr}
                        data-date={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`
                          shrink-0 w-14 py-2 rounded-xl flex flex-col items-center transition-all duration-300 relative
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
                          className={`text-[10px] font-medium ${
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
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"
            aria-label="向右滚动"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={resetToToday}
            disabled={isSelectedToday && viewMode === "all"}
            className={`
              shrink-0 ml-1 h-9 px-3 rounded-xl flex items-center gap-1 text-xs font-medium transition-all duration-300
              ${
                isSelectedToday && viewMode === "all"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary-500 text-white shadow-md shadow-primary-500/25 hover:bg-primary-600 active:scale-95"
              }
            `}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            今天
          </button>
        </div>
      </div>
    </div>
  );
}
