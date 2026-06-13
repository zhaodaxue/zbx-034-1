import { describe, it, expect, beforeEach } from "vitest";
import { screen, within, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp, resetStores, findBuildingCardByName, getHeaderStatValue, getListBadges } from "@/test/testUtils";
import { useReadStore } from "@/store/useReadStore";

const STORAGE_KEY = "building-read-status";

describe("已读闭环（详情抽屉→卡片→顶栏→持久化）", () => {
  beforeEach(() => {
    cleanup();
    resetStores();
  });

  it("初始态：卡片无已读标识，顶栏未读=6", () => {
    renderApp();
    const cards = screen.getAllByRole("heading", { level: 3 });
    cards.forEach((c) => {
      const card = c.closest('[class*="cursor-pointer"]') as HTMLElement;
      expect(within(card).queryByText("已读")).toBeNull();
    });
    expect(getHeaderStatValue("未读")).toBe("6");
  });

  it("打开 5 号楼详情 → 标记已读 → 抽屉显示已读，关闭后卡片出现「已读」态", async () => {
    const user = userEvent.setup();
    renderApp();

    const b5Card = findBuildingCardByName("5号楼");
    await user.click(b5Card!);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "标记已读" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "标记已读" }));

    await waitFor(() => {
      expect(screen.getByText(/您已阅读此告知/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "关闭" }));

    const cardAfter = findBuildingCardByName("5号楼")!;
    expect(within(cardAfter).getByText("已读")).toBeInTheDocument();

    expect(getHeaderStatValue("未读")).toBe("5");
    expect(getHeaderStatValue("已读")).toBe("1");
  });

  it("模拟页面刷新：写入 localStorage → 重建 store → 已读状态仍保留", () => {
    useReadStore.getState().markAsRead("b1");
    useReadStore.getState().markAsRead("b5");

    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const persisted = JSON.parse(raw as string);
    expect(persisted.b1.isRead).toBe(true);
    expect(persisted.b5.isRead).toBe(true);

    useReadStore.setState({ statusMap: {} });

    expect(useReadStore.getState().isRead("b1")).toBe(false);

    expect(Object.keys(persisted).length).toBe(2);
    expect(persisted.b5.readAt).toBeLessThanOrEqual(Date.now());
  });

  it("已读 3 栋：顶栏计数正确，列表口径依然按全部 6 栋", async () => {
    renderApp();
    useReadStore.getState().markAsRead("b2");
    useReadStore.getState().markAsRead("b4");
    useReadStore.getState().markAsRead("b6");

    await waitFor(() => {
      expect(getHeaderStatValue("未读")).toBe("3");
      expect(getHeaderStatValue("已读")).toBe("3");
    });

    const badges = getListBadges();
    expect(badges.total).toMatch(/6 栋/);
  });

  it("详情抽屉已读后，再打开其他楼栋仍显示标记已读按钮", async () => {
    const user = userEvent.setup();
    renderApp();

    const b1Card = findBuildingCardByName("1号楼")!;
    await user.click(b1Card);
    await user.click(screen.getByRole("button", { name: "标记已读" }));
    await user.click(screen.getByRole("button", { name: "关闭" }));

    const b2Card = findBuildingCardByName("2号楼")!;
    await user.click(b2Card);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "标记已读" })).toBeInTheDocument();
    });
  });
});
