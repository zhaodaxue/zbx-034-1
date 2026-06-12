import type { Building } from "@/types";

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getWeekDates(baseDate: Date = new Date()): Date[] {
  const dates: Date[] = [];
  const current = new Date(baseDate);
  const dayOfWeek = current.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  current.setDate(current.getDate() + diffToMonday);

  for (let i = 0; i < 7; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function getExtendedDates(
  baseDate: Date = new Date(),
  weeksBefore: number = 2,
  weeksAfter: number = 2
): Date[] {
  const dates: Date[] = [];
  const current = new Date(baseDate);
  const dayOfWeek = current.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  current.setDate(current.getDate() + diffToMonday - weeksBefore * 7);

  const totalDays = (weeksBefore + 1 + weeksAfter) * 7;
  for (let i = 0; i < totalDays; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return formatDate(date) === formatDate(today);
}

export function isTodayStr(dateStr: string): boolean {
  return dateStr === formatDate(new Date());
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isWeekendStr(dateStr: string): boolean {
  const date = new Date(dateStr + "T00:00:00");
  return isWeekend(date);
}

export function hasWeekendDate(dateStrs: string[]): boolean {
  return dateStrs.some(isWeekendStr);
}

export function hasWeekendConstruction(building: Building): boolean {
  return hasWeekendDate(building.constructionDates);
}

export function buildingHasWeekendConstruction(building: Building): boolean {
  return hasWeekendDate(building.constructionDates);
}

export function getWeekdayName(date: Date): string {
  const names = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return names[date.getDay()];
}

export function filterBuildingsByDate(
  buildings: Building[],
  dateStr: string
): Building[] {
  return buildings.filter((b) => b.constructionDates.includes(dateStr));
}

export function getMonthLabel(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}
