import { describe, it, expect } from "vitest";
import {
  sortBuildingsForDisplay,
  countTodayBuildings,
  countWeekendBuildings,
} from "@/utils/buildingSorter";
import { filterBuildingsByDate } from "@/utils/calendarFilter";
import type { Building } from "@/types";

const mockBuildings = [
  {
    id: "b4",
    name: "4号楼",
    constructionDates: ["2026-06-15", "2026-06-16", "2026-06-17", "2026-06-18", "2026-06-19"],
    involvesWeekend: false,
  },
  {
    id: "b6",
    name: "6号楼",
    constructionDates: ["2026-06-17", "2026-06-18", "2026-06-19", "2026-06-20", "2026-06-21"],
    involvesWeekend: true,
  },
  {
    id: "b2",
    name: "2号楼",
    constructionDates: ["2026-06-12", "2026-06-13", "2026-06-16", "2026-06-17", "2026-06-18"],
    involvesWeekend: true,
  },
  {
    id: "b1",
    name: "1号楼",
    constructionDates: ["2026-06-12", "2026-06-13", "2026-06-14", "2026-06-15"],
    involvesWeekend: true,
  },
  {
    id: "b3",
    name: "3号楼",
    constructionDates: ["2026-06-12", "2026-06-13", "2026-06-14", "2026-06-15"],
    involvesWeekend: true,
  },
  {
    id: "b5",
    name: "5号楼",
    constructionDates: ["2026-06-13", "2026-06-14", "2026-06-15", "2026-06-16"],
    involvesWeekend: true,
  },
] as Building[];

describe("楼栋排序与统计工具（固定今日 2026-06-12 周五）", () => {
  it("全部视图排序：今日施工优先 → 选中日有施工 → 含周末施工 → 楼号名称", () => {
    const sorted = sortBuildingsForDisplay(mockBuildings, "2026-06-17", "all");
    const ids = sorted.map((s) => s.id);

    const todayIds = ["b1", "b2", "b3"];
    const notTodayIds = ids.filter((id) => !todayIds.includes(id));
    expect(todayIds.every((id) => ids.indexOf(id) < ids.indexOf(notTodayIds[0]))).toBe(true);

    const b2Idx = ids.indexOf("b2");
    const b6Idx = ids.indexOf("b6");
    const b4Idx = ids.indexOf("b4");
    expect(b2Idx).toBeLessThan(b6Idx);
    expect(b6Idx).toBeLessThan(b4Idx);
  });

  it("全部视图 + 选中今日（6/12）：今日施工 1、2、3 号楼在最前", () => {
    const sorted = sortBuildingsForDisplay(mockBuildings, "2026-06-12", "all");
    const top3 = sorted.slice(0, 3).map((s) => s.id);
    expect(top3).toEqual(expect.arrayContaining(["b1", "b2", "b3"]));
  });

  it("仅当日视图：配合 filterBuildingsByDate 过滤后再排序 → 6/17 返回 b2、b6、b4（涉周末在前）", () => {
    const filtered = filterBuildingsByDate(mockBuildings, "2026-06-17");
    const sorted = sortBuildingsForDisplay(filtered, "2026-06-17", "day");
    const ids = sorted.map((s) => s.id);
    expect(ids).toEqual(["b2", "b6", "b4"]);
  });

  it("仅当日视图：配合过滤 6/13（周六）→ 1、2、3、5 号楼（都是涉周末，按名称排序）", () => {
    const filtered = filterBuildingsByDate(mockBuildings, "2026-06-13");
    const sorted = sortBuildingsForDisplay(filtered, "2026-06-13", "day");
    const ids = sorted.map((s) => s.id);
    expect(ids).toEqual(["b1", "b2", "b3", "b5"]);
  });

  it("今日施工统计 countTodayBuildings（2026-06-12）：1、2、3 号楼，共 3 栋", () => {
    expect(countTodayBuildings(mockBuildings)).toBe(3);
  });

  it("周末施工统计 countWeekendBuildings：动态按真实施工日期判定，共 5 栋（仅 b4 不涉周末）", () => {
    expect(countWeekendBuildings(mockBuildings)).toBe(5);
  });

  it("4 号楼不涉及任何周末施工日", () => {
    const b4 = mockBuildings.find((b) => b.id === "b4")!;
    expect(countWeekendBuildings([b4])).toBe(0);
  });

  it("6 号楼包含周六（6/20）、周日（6/21）→ 判定涉周末", () => {
    const b6 = mockBuildings.find((b) => b.id === "b6")!;
    expect(countWeekendBuildings([b6])).toBe(1);
  });

  it("空列表排序与统计不报错", () => {
    expect(sortBuildingsForDisplay([], "2026-06-12", "all")).toEqual([]);
    expect(countTodayBuildings([])).toBe(0);
    expect(countWeekendBuildings([])).toBe(0);
  });
});
