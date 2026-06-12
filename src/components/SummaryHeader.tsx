import { Hammer, CalendarCheck, Eye, EyeOff, HardHat } from "lucide-react";
import type { Building } from "@/types";
import { countTodayBuildings, countWeekendBuildings } from "@/utils/buildingSorter";
import { useReadStore } from "@/store/useReadStore";

interface Props {
  buildings: Building[];
}

export default function SummaryHeader({ buildings }: Props) {
  const statusMap = useReadStore((s) => s.statusMap);

  const todayCount = countTodayBuildings(buildings);
  const weekendCount = countWeekendBuildings(buildings);
  const allIds = buildings.map((b) => b.id);
  const readCount = allIds.filter((id) => statusMap[id]?.isRead).length;
  const unreadCount = allIds.filter((id) => !statusMap[id]?.isRead).length;

  const stats = [
    {
      label: "今日施工",
      value: todayCount,
      unit: "栋",
      icon: Hammer,
      color: "primary",
      iconBg: "bg-primary-500/10",
      iconColor: "text-primary-500",
      valueColor: "text-primary-600",
    },
    {
      label: "周末施工",
      value: weekendCount,
      unit: "栋",
      icon: CalendarCheck,
      color: "warn",
      iconBg: "bg-warn-500/10",
      iconColor: "text-warn-500",
      valueColor: "text-warn-600",
    },
    {
      label: "已读",
      value: readCount,
      unit: "条",
      icon: Eye,
      color: "green",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
      valueColor: "text-green-600",
    },
    {
      label: "未读",
      value: unreadCount,
      unit: "条",
      icon: EyeOff,
      color: "slate",
      iconBg: "bg-slate-500/10",
      iconColor: "text-slate-500",
      valueColor: "text-slate-600",
    },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm sticky top-0 z-30">
      <div className="container py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 tracking-tight">施工噪音告知</h1>
              <p className="text-xs text-gray-400">老旧小区改造办</p>
            </div>
          </div>
          <div className="text-xs text-gray-400 font-medium bg-gray-50 px-2.5 py-1 rounded-full">
            共 {buildings.length} 栋楼
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-gray-50/80 rounded-xl p-3 hover:bg-white hover:shadow-md transition-all duration-300 cursor-default group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-4 h-4 ${s.iconColor}`} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{s.label}</span>
                </div>
                <div className="flex items-baseline gap-1 pl-1">
                  <span className={`text-2xl font-bold tracking-tight ${s.valueColor}`}>
                    {s.value}
                  </span>
                  <span className="text-xs text-gray-400">{s.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
