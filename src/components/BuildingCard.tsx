import { AlertTriangle, Clock, Phone, Building2, Check } from "lucide-react";
import type { Building } from "@/types";
import { formatDate } from "@/utils/calendarFilter";
import { useReadStore } from "@/store/useReadStore";
import { useCalendarStore } from "@/store/useCalendarStore";

interface Props {
  building: Building;
  onClick: () => void;
}

const typeStyles: Record<Building["constructionType"], { bg: string; text: string; border: string; label: string }> = {
  外立面: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", label: "外立面" },
  管道: { bg: "bg-sky-100", text: "text-sky-700", border: "border-sky-200", label: "管道" },
  电梯: { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-200", label: "电梯" },
};

export default function BuildingCard({ building, onClick }: Props) {
  const statusMap = useReadStore((s) => s.statusMap);
  const selectedDate = useCalendarStore((s) => s.selectedDate);

  const todayStr = formatDate(new Date());
  const hasConstructionToday = building.constructionDates.includes(todayStr);
  const hasConstructionOnSelected = building.constructionDates.includes(selectedDate);
  const isSelectedToday = selectedDate === todayStr;
  const showTopBadge = isSelectedToday && hasConstructionToday;
  const read = statusMap[building.id]?.isRead ?? false;
  const typeStyle = typeStyles[building.constructionType];
  const selectedDateObj = new Date(selectedDate + "T00:00:00");
  const selectedIsWeekend = selectedDateObj.getDay() === 0 || selectedDateObj.getDay() === 6;
  const showWeekendWarn = building.involvesWeekend && selectedIsWeekend && hasConstructionOnSelected;

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
        hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99]
        ${showTopBadge ? "ring-2 ring-primary-400 shadow-md" : "border border-gray-100 shadow-sm"}
      `}
    >
      <div className="flex">
        {showWeekendWarn && (
          <div className="flex flex-col items-center justify-center bg-warn-500 w-12 shrink-0 py-4">
            <div className="flex flex-col items-center gap-1 text-white">
              <AlertTriangle className="w-6 h-6" />
              <span className="text-[10px] font-bold leading-tight text-center">周末</span>
              <span className="text-[10px] font-bold leading-tight text-center">施工</span>
            </div>
          </div>
        )}
        <div className={`flex-1 ${showWeekendWarn ? "p-4 pl-3" : "p-4"}`}>
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${typeStyle.bg} border ${typeStyle.border}`}>
              <Building2 className={`w-6 h-6 ${typeStyle.text}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-bold text-gray-800">{building.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${typeStyle.bg} ${typeStyle.text} font-medium border ${typeStyle.border}`}>
                  {typeStyle.label}施工
                </span>
                {showTopBadge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500 text-white font-medium animate-pulse">
                    今日施工
                  </span>
                )}
                {showWeekendWarn && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-warn-500/10 text-warn-600 font-medium flex items-center gap-0.5">
                    <AlertTriangle className="w-3 h-3" /> 周末施工
                  </span>
                )}
                {read && (
                  <span className="ml-auto text-xs text-green-600 flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> 已读
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {building.timeSlotStart}–{building.timeSlotEnd}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{building.contactName}</span>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {building.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
