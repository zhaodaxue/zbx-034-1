import { describe, it, expect } from "vitest";
import {
  formatDate,
  getWeekDates,
  getExtendedDates,
  isToday,
  isTodayStr,
  isWeekend,
  isWeekendStr,
  hasWeekendDate,
  hasWeekendConstruction,
  filterBuildingsByDate,
  getWeekdayName,
  getMonthLabel,
} from "@/utils/calendarFilter";
import type { Building } from "@/types";

describe("日历过滤工具函数（固定系统日期 2026-06-12 周五）", () => {
  it("formatDate: 格式化 Date 为 YYYY-MM-DD", () => {
    const d = new Date("2026-06-12T00:00:00");
    expect(formatDate(d)).toBe("2026-06-12");
  });

  it("isToday / isTodayStr: 判断是否为今日", () => {
    const today = new Date("2026-06-12T12:00:00");
    const other = new Date("2026-06-13T00:00:00");
    expect(isToday(today)).toBe(true);
    expect(isToday(other)).toBe(false);
    expect(isTodayStr("2026-06-12")).toBe(true);
    expect(isTodayStr("2026-06-13")).toBe(false);
  });

  it("isWeekend / isWeekendStr: 判断周末（周六、周日）", () => {
    const fri = new Date("2026-06-12");
    const sat = new Date("2026-06-13");
    const sun = new Date("2026-06-14");
    expect(isWeekend(fri)).toBe(false);
    expect(isWeekend(sat)).toBe(true);
    expect(isWeekend(sun)).toBe(true);
    expect(isWeekendStr("2026-06-13")).toBe(true);
    expect(isWeekendStr("2026-06-12")).toBe(false);
  });

  it("getWeekDates: 以周一为周起始返回本周 7 天", () => {
    const base = new Date("2026-06-12");
    const week = getWeekDates(base);
    expect(week.length).toBe(7);
    expect(formatDate(week[0])).toBe("2026-06-08");
    expect(formatDate(week[6])).toBe("2026-06-14");
    expect(getWeekdayName(week[0])).toBe("周一");
    expect(getWeekdayName(week[5])).toBe("周六");
  });

  it("getExtendedDates: 返回前后扩展多周日历", () => {
    const base = new Date("2026-06-12");
    const dates = getExtendedDates(base, 1, 1);
    expect(dates.length).toBe(21);
    expect(formatDate(dates[0])).toBe("2026-06-01");
    expect(formatDate(dates[20])).toBe("2026-06-21");
  });

  it("hasWeekendDate: 判断日期数组中是否包含周末", () => {
    const workdays = ["2026-06-10", "2026-06-11", "2026-06-12"];
    const withSat = ["2026-06-12", "2026-06-13"];
    const withSun = ["2026-06-14", "2026-06-15"];
    expect(hasWeekendDate(workdays)).toBe(false);
    expect(hasWeekendDate(withSat)).toBe(true);
    expect(hasWeekendDate(withSun)).toBe(true);
  });

  it("hasWeekendConstruction: 从 Building 判断是否涉及周末施工", () => {
    const b1 = { constructionDates: ["2026-06-10", "2026-06-11", "2026-06-12"] } as Building;
    const b2 = { constructionDates: ["2026-06-12", "2026-06-13", "2026-06-14"] } as Building;
    expect(hasWeekendConstruction(b1)).toBe(false);
    expect(hasWeekendConstruction(b2)).toBe(true);
  });

  it("filterBuildingsByDate: 按日期过滤出当日有施工的楼栋", () => {
    const buildings = [
      { id: "a", constructionDates: ["2026-06-12", "2026-06-13"] },
      { id: "b", constructionDates: ["2026-06-12"] },
      { id: "c", constructionDates: ["2026-06-15"] },
    ] as Building[];
    const result = filterBuildingsByDate(buildings, "2026-06-12");
    expect(result.map((r) => r.id)).toEqual(["a", "b"]);
    expect(filterBuildingsByDate(buildings, "2026-06-16")).toEqual([]);
  });

  it("getMonthLabel / getWeekdayName: 返回中文标签", () => {
    const d = new Date("2026-06-12");
    expect(getMonthLabel(d)).toBe("2026年6月");
    expect(getWeekdayName(d)).toBe("周五");
  });
});
