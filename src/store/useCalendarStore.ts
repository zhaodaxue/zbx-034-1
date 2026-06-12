import { create } from "zustand";
import { formatDate, getWeekDates, getExtendedDates } from "@/utils/calendarFilter";
import { buildings } from "@/data/buildings";

type ViewMode = "day" | "all";

function getAllConstructionDatesRange(): { start: Date; end: Date } {
  const allDates = buildings.flatMap((b) => b.constructionDates);
  const sorted = [...allDates].sort();
  const start = new Date(sorted[0] + "T00:00:00");
  const end = new Date(sorted[sorted.length - 1] + "T00:00:00");
  return { start, end };
}

interface CalendarState {
  viewMode: ViewMode;
  selectedDate: string;
  weekBaseDate: Date;
  weekDates: Date[];
  extendedDates: Date[];
  setSelectedDate: (date: string) => void;
  setViewMode: (mode: ViewMode) => void;
  resetToToday: () => void;
  goToPrevWeek: () => void;
  goToNextWeek: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => {
  const today = new Date();
  const { start: rangeStart, end: rangeEnd } = getAllConstructionDatesRange();

  const base = new Date(today);
  if (base < rangeStart) base.setTime(rangeStart.getTime());
  if (base > rangeEnd) base.setTime(rangeEnd.getTime());

  const diffMs = today.getTime() - rangeStart.getTime();
  const weeksBefore = Math.max(1, Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000)));
  const diffEndMs = rangeEnd.getTime() - today.getTime();
  const weeksAfter = Math.max(1, Math.ceil(diffEndMs / (7 * 24 * 60 * 60 * 1000)) + 1);

  return {
    viewMode: "all",
    selectedDate: formatDate(today),
    weekBaseDate: base,
    weekDates: getWeekDates(base),
    extendedDates: getExtendedDates(today, weeksBefore, weeksAfter),

    setSelectedDate: (date) => {
      set({ selectedDate: date, viewMode: "day" });
      const currentBase = get().weekBaseDate;
      const targetDate = new Date(date + "T00:00:00");
      const currentWeekStart = getWeekDates(currentBase)[0];
      const targetWeekStart = getWeekDates(targetDate)[0];
      if (currentWeekStart.getTime() !== targetWeekStart.getTime()) {
        set({ weekBaseDate: targetDate, weekDates: getWeekDates(targetDate) });
      }
    },

    setViewMode: (mode) => set({ viewMode: mode }),

    resetToToday: () => {
      const t = new Date();
      set({
        selectedDate: formatDate(t),
        weekBaseDate: t,
        weekDates: getWeekDates(t),
        viewMode: "all",
      });
    },

    goToPrevWeek: () => {
      const current = new Date(get().weekBaseDate);
      current.setDate(current.getDate() - 7);
      set({ weekBaseDate: current, weekDates: getWeekDates(current) });
    },

    goToNextWeek: () => {
      const current = new Date(get().weekBaseDate);
      current.setDate(current.getDate() + 7);
      set({ weekBaseDate: current, weekDates: getWeekDates(current) });
    },
  };
});
