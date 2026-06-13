import { describe, it, expect, beforeEach } from "vitest";
import { useCalendarStore } from "@/store/useCalendarStore";
import { formatDate } from "@/utils/calendarFilter";

describe("日历状态 store（固定今日 2026-06-12）", () => {
  beforeEach(() => {
    useCalendarStore.setState({
      selectedDate: formatDate(new Date()),
      viewMode: "all",
      weekBaseDate: new Date(),
      weekDates: [],
      extendedDates: [],
    });
    const init = useCalendarStore.getInitialState();
    useCalendarStore.setState({
      weekDates: init.weekDates,
      extendedDates: init.extendedDates,
      weekBaseDate: init.weekBaseDate,
    });
  });

  it("初始化：selectedDate 默认为今日，viewMode 为全部楼栋，extendedDates 覆盖施工日期范围", () => {
    const s = useCalendarStore.getState();
    expect(s.selectedDate).toBe("2026-06-12");
    expect(s.viewMode).toBe("all");
    const dateStrs = s.extendedDates.map(formatDate);
    expect(dateStrs).toContain("2026-06-08");
    expect(dateStrs).toContain("2026-06-12");
    expect(dateStrs).toContain("2026-06-21");
  });

  it("setSelectedDate: 切换日期自动切为「仅当日」模式，并切换到对应周", () => {
    useCalendarStore.getState().setSelectedDate("2026-06-17");
    const s = useCalendarStore.getState();
    expect(s.selectedDate).toBe("2026-06-17");
    expect(s.viewMode).toBe("day");
    const weekStrs = s.weekDates.map(formatDate);
    expect(weekStrs).toContain("2026-06-17");
  });

  it("setViewMode: 切换视图模式不影响选中日期", () => {
    useCalendarStore.getState().setSelectedDate("2026-06-13");
    useCalendarStore.getState().setViewMode("all");
    const s = useCalendarStore.getState();
    expect(s.viewMode).toBe("all");
    expect(s.selectedDate).toBe("2026-06-13");
  });

  it("resetToToday: 重置日期为今日并回到全部视图", () => {
    useCalendarStore.getState().setSelectedDate("2026-06-20");
    useCalendarStore.getState().resetToToday();
    const s = useCalendarStore.getState();
    expect(s.selectedDate).toBe("2026-06-12");
    expect(s.viewMode).toBe("all");
  });

  it("goToPrevWeek / goToNextWeek: 跨周导航更新 weekBaseDate", () => {
    const before = useCalendarStore.getState().weekDates.map(formatDate);
    useCalendarStore.getState().goToNextWeek();
    const next = useCalendarStore.getState().weekDates.map(formatDate);
    expect(next[0]).not.toBe(before[0]);
    expect(next).toContain("2026-06-19");
    useCalendarStore.getState().goToPrevWeek();
    useCalendarStore.getState().goToPrevWeek();
    const prev = useCalendarStore.getState().weekDates.map(formatDate);
    expect(prev).toContain("2026-06-05");
  });
});
