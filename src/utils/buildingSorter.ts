import type { Building } from "@/types";
import { formatDate } from "./calendarFilter";

export function sortBuildingsForDisplay(
  buildings: Building[],
  selectedDate: string
): Building[] {
  const todayStr = formatDate(new Date());
  const isSelectedToday = selectedDate === todayStr;

  return [...buildings].sort((a, b) => {
    if (isSelectedToday) {
      const aToday = a.constructionDates.includes(todayStr);
      const bToday = b.constructionDates.includes(todayStr);
      if (aToday && !bToday) return -1;
      if (!aToday && bToday) return 1;
    }

    if (a.involvesWeekend && !b.involvesWeekend) return -1;
    if (!a.involvesWeekend && b.involvesWeekend) return 1;

    return a.name.localeCompare(b.name);
  });
}

export function countTodayBuildings(buildings: Building[]): number {
  const todayStr = formatDate(new Date());
  return buildings.filter((b) => b.constructionDates.includes(todayStr)).length;
}

export function countWeekendBuildings(buildings: Building[]): number {
  return buildings.filter((b) => b.involvesWeekend).length;
}
