import { useMemo, useState } from "react";
import { Inbox, CalendarRange } from "lucide-react";
import type { Building } from "@/types";
import BuildingCard from "./BuildingCard";
import DetailDrawer from "./DetailDrawer";
import { useCalendarStore } from "@/store/useCalendarStore";
import { filterBuildingsByDate } from "@/utils/calendarFilter";
import { sortBuildingsForDisplay } from "@/utils/buildingSorter";

interface Props {
  buildings: Building[];
}

export default function BuildingList({ buildings }: Props) {
  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const [activeBuilding, setActiveBuilding] = useState<Building | null>(null);

  const displayBuildings = useMemo(() => {
    const filtered = filterBuildingsByDate(buildings, selectedDate);
    return sortBuildingsForDisplay(filtered, selectedDate);
  }, [buildings, selectedDate]);

  return (
    <main className="container py-4 pb-20">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <CalendarRange className="w-4 h-4 text-primary-500" />
          {selectedDate} 施工安排
        </h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {displayBuildings.length} 栋
        </span>
      </div>

      {displayBuildings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Inbox className="w-16 h-16 mb-3 text-gray-200" />
          <p className="text-sm font-medium">当日暂无施工安排</p>
          <p className="text-xs mt-1 text-gray-300">请选择其他日期查看</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayBuildings.map((b) => (
            <BuildingCard
              key={b.id}
              building={b}
              onClick={() => setActiveBuilding(b)}
            />
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
