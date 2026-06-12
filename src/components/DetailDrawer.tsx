import {
  X,
  Clock,
  Phone,
  CalendarDays,
  AlertTriangle,
  Check,
  Building2,
  User,
} from "lucide-react";
import type { Building } from "@/types";
import { useReadStore } from "@/store/useReadStore";

interface Props {
  building: Building | null;
  onClose: () => void;
}

const typeStyles: Record<Building["constructionType"], { bg: string; text: string; border: string; label: string }> = {
  外立面: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", label: "外立面改造" },
  管道: { bg: "bg-sky-100", text: "text-sky-700", border: "border-sky-200", label: "管道工程" },
  电梯: { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-200", label: "电梯施工" },
};

export default function DetailDrawer({ building, onClose }: Props) {
  const statusMap = useReadStore((s) => s.statusMap);
  const markAsRead = useReadStore((s) => s.markAsRead);

  if (!building) return null;

  const read = statusMap[building.id]?.isRead ?? false;
  const typeStyle = typeStyles[building.constructionType];

  const sortedDates = [...building.constructionDates].sort();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-800">施工详情</h2>
            {read && (
              <span className="text-xs text-green-600 flex items-center gap-0.5 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                <Check className="w-3 h-3" /> 已读
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-start gap-3 mb-6">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${typeStyle.bg} border ${typeStyle.border}`}>
              <Building2 className={`w-7 h-7 ${typeStyle.text}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-800">{building.name}</h3>
              </div>
              <span className={`text-sm px-2.5 py-1 rounded-full ${typeStyle.bg} ${typeStyle.text} font-medium border ${typeStyle.border}`}>
                {typeStyle.label}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                施工时段
              </h4>
              <div className="bg-primary-50/50 rounded-xl p-3.5 flex items-center gap-3 border border-primary-100/50">
                <Clock className="w-5 h-5 text-primary-500" />
                <div>
                  <div className="text-lg font-bold text-gray-800">
                    {building.timeSlotStart} – {building.timeSlotEnd}
                  </div>
                  <div className="text-xs text-gray-500">每日允许施工时间</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                计划施工日期
              </h4>
              <div className="bg-gray-50/80 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="w-5 h-5 text-primary-500" />
                  <span className="text-sm font-medium text-gray-700">
                    共 {sortedDates.length} 天
                  </span>
                  {building.involvesWeekend && (
                    <span className="text-xs text-warn-600 flex items-center gap-0.5 ml-auto bg-warn-500/10 px-2 py-0.5 rounded-full border border-warn-200">
                      <AlertTriangle className="w-3 h-3" /> 涉及周末
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sortedDates.map((d) => {
                    const dateObj = new Date(d + "T00:00:00");
                    const day = dateObj.getDay();
                    const isWeekendDay = day === 0 || day === 6;
                    return (
                      <span
                        key={d}
                        className={`text-xs px-2 py-1 rounded-md font-medium ${
                          isWeekendDay
                            ? "bg-warn-500/10 text-warn-600 border border-warn-200"
                            : "bg-white text-gray-600 border border-gray-200"
                        }`}
                      >
                        {d.slice(5)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                联系人
              </h4>
              <div className="bg-gray-50/80 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center border border-primary-200">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">
                    {building.contactName}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {building.contactPhone}
                  </div>
                </div>
                <a
                  href={`tel:${building.contactPhone.replace(/-/g, "")}`}
                  className="px-3 py-1.5 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors shadow-sm"
                >
                  拨打
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                施工说明
              </h4>
              <div className="bg-primary-50/40 rounded-xl p-4 border border-primary-100/50">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {building.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          {read ? (
            <div className="w-full py-3 bg-green-50 text-green-600 rounded-xl font-semibold text-center flex items-center justify-center gap-2 border border-green-200">
              <Check className="w-5 h-5" />
              您已阅读此告知
            </div>
          ) : (
            <button
              onClick={() => markAsRead(building.id)}
              className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25"
            >
              标记已读
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
