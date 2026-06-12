import type { Building } from "@/types";
import { formatDate, isTodayStr, hasWeekendConstruction } from "./calendarFilter";

type ViewMode = "day" | "all";

export function sortBuildingsForDisplay(
  buildings: Building[],
  selectedDate: string,
  viewMode: ViewMode = "day"
): Building[] {
  const todayStr = formatDate(new Date());

  return [...buildings].sort((a, b) => {
    const aToday = a.constructionDates.includes(todayStr);
    const bToday = b.constructionDates.includes(todayStr);
    if (viewMode === "all") {
      if (aToday && !bToday) return -1;
      if (!aToday && bToday) return 1;
    }

    const aSelectedDay = a.constructionDates.includes(selectedDate);
    const bSelectedDay = b.constructionDates.includes(selectedDate);
    if (aSelectedDay && !bSelectedDay) return -1;
    if (!aSelectedDay && bSelectedDay) return 1;

    const aWeekend = hasWeekendConstruction(a);
    const bWeekend = hasWeekendConstruction(b);
    if (aWeekend && !bWeekend) return -1;
    if (!aWeekend && bWeekend) return 1;

    return a.name.localeCompare(b.name);
  });
}

export function countTodayBuildings(buildings: Building[]): number {
  const todayStr = formatDate(new Date());
  return buildings.filter((b) => b.constructionDates.includes(todayStr)).length;
}

export function countWeekendBuildings(buildings: Building[]): number {
  return buildings.filter((b) => hasWeekendConstruction(b)).length;
}

export { isTodayStr };
