import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp, resetStores, getHeaderStatValue, getListBadges, clickDateButton } from "@/test/testUtils";
import { useReadStore } from "@/store/useReadStore";

describe("顶栏与列表口径差异（全部楼栋 vs 仅当日）", () => {
  beforeEach(() => {
    resetStores();
  });

  it("顶栏始终按全部 6 栋统计：今日施工 3 栋、周末施工 5 栋、未读 6 / 已读 0", () => {
    renderApp();

    expect(getHeaderStatValue("今日施工")).toBe("3");
    expect(getHeaderStatValue("周末施工")).toBe("5");
    expect(getHeaderStatValue("已读")).toBe("0");
    expect(getHeaderStatValue("未读")).toBe("6");
  });

  it("全部楼栋视图：列表区徽标 今日3栋、涉周末5栋、总6栋", async () => {
    renderApp();

    await waitFor(() => {
      const listHeader = screen.getByRole("heading", { level: 2 });
      expect(listHeader).toHaveTextContent("全部楼栋施工安排");
    });

    const badges = getListBadges();
    expect(badges.total).toMatch(/6 栋/);
    expect(badges.today).toMatch(/今日3栋/);
    expect(badges.weekend).toMatch(/涉周末5栋/);
  });

  it("仅当日视图（6/17）：列表区徽标按当日 2、4、6 三栋统计，顶栏数字不变", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(clickDateButton("周三", "17"));
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("2026-06-17");
    });

    const badges = getListBadges();
    expect(badges.total).toMatch(/3 栋/);
    expect(badges.today).toMatch(/今日1栋/);
    expect(badges.weekend).toMatch(/涉周末2栋/);

    expect(getHeaderStatValue("今日施工")).toBe("3");
    expect(getHeaderStatValue("未读")).toBe("6");
  });

  it("标记 b3 已读：顶栏未读 6→5，已读 0→1；列表区总栋数仍 6", async () => {
    renderApp();
    await waitFor(() => {
      expect(getHeaderStatValue("未读")).toBe("6");
    });

    useReadStore.getState().markAsRead("b3");

    await waitFor(() => {
      expect(getHeaderStatValue("未读")).toBe("5");
      expect(getHeaderStatValue("已读")).toBe("1");
    });

    const badges = getListBadges();
    expect(badges.total).toMatch(/6 栋/);
  });
});
