import { create } from "zustand";
import { formatDate, getWeekDates } from "@/utils/calendarFilter";

interface CalendarState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  resetToToday: () => void;
  weekDates: Date[];
}

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedDate: formatDate(new Date()),
  weekDates: getWeekDates(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  resetToToday: () => set({ selectedDate: formatDate(new Date()) }),
}));
