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

export function isToday(date: Date): boolean {
  const today = new Date();
  return formatDate(date) === formatDate(today);
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
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
