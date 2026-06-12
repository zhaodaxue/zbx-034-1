import { useMemo, useState } from "react";
import { Inbox, CalendarRange, Hammer, AlertTriangle, Layers } from "lucide-react";
import type { Building } from "@/types";
import BuildingCard from "./BuildingCard";
import DetailDrawer from "./DetailDrawer";
import { useCalendarStore } from "@/store/useCalendarStore";
import { filterBuildingsByDate, formatDate, hasWeekendConstruction } from "@/utils/calendarFilter";
import { sortBuildingsForDisplay } from "@/utils/buildingSorter";

interface Props {
  buildings: Building[];
}

export default function BuildingList({ buildings }: Props) {
  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const viewMode = useCalendarStore((s) => s.viewMode);
  const [activeBuilding, setActiveBuilding] = useState<Building | null>(null);

  const displayBuildings = useMemo(() => {
    let source: Building[];
    if (viewMode === "day") {
      source = filterBuildingsByDate(buildings, selectedDate);
    } else {
      source = buildings;
    }
    return sortBuildingsForDisplay(source, selectedDate, viewMode);
  }, [buildings, selectedDate, viewMode]);

  const todayStr = formatDate(new Date());
  const todayCount = useMemo(
    () => displayBuildings.filter((b) => b.constructionDates.includes(todayStr)).length,
    [displayBuildings, todayStr]
  );
  const weekendCount = useMemo(
    () => displayBuildings.filter((b) => hasWeekendConstruction(b)).length,
    [displayBuildings]
  );

  return (
    <main className="container py-4 pb-20">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          {viewMode === "all" ? (
            <>
              <Layers className="w-4 h-4 text-primary-500" />
              全部楼栋施工安排
            </>
          ) : (
            <>
              <CalendarRange className="w-4 h-4 text-primary-500" />
              {selectedDate} 施工安排
            </>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {todayCount > 0 && (
            <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Hammer className="w-3 h-3" /> 今日{todayCount}栋
            </span>
          )}
          {weekendCount > 0 && (
            <span className="text-xs text-warn-600 bg-warn-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> 涉周末{weekendCount}栋
            </span>
          )}
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {displayBuildings.length} 栋
          </span>
        </div>
      </div>

      {displayBuildings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Inbox className="w-16 h-16 mb-3 text-gray-200" />
          <p className="text-sm font-medium">当日暂无施工安排</p>
          <p className="text-xs mt-1 text-gray-300">请选择其他日期查看</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayBuildings.map((b, idx) => (
            <div
              key={b.id}
              className="animate-card-enter"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <BuildingCard
                building={b}
                onClick={() => setActiveBuilding(b)}
              />
            </div>
          ))}
        </div>
      )}

      <DetailDrawer
        building={activeBuilding}
        onClose={() => setActiveBuilding(null)}
      />
    </main>
  );
}
