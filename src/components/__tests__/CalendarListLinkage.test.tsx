import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp, resetStores, clickDateButton } from "@/test/testUtils";

describe("日历 ↔ 列表联动（固定今日 2026-06-12 周五）", () => {
  beforeEach(() => {
    resetStores();
  });

  it("初始状态：全部楼栋视图，展示 6 栋，今日施工楼栋置顶", () => {
    renderApp();

    const listHeader = screen.getByRole("heading", { level: 2 });
    expect(listHeader).toHaveTextContent("全部楼栋施工安排");

    const buildingCards = screen.getAllByRole("heading", { level: 3 });
    expect(buildingCards).toHaveLength(6);

    const topName = buildingCards[0].textContent;
    expect(["1号楼", "2号楼", "3号楼"]).toContain(topName);
  });

  it("点选 6/17（周三）→ 自动切为「仅当日」，只展示 2、4、6 号楼", async () => {
    const user = userEvent.setup();
    renderApp();

    const day17 = clickDateButton("周三", "17");
    await user.click(day17);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("2026-06-17");
    });

    const buildingCards = screen.getAllByRole("heading", { level: 3 });
    expect(buildingCards).toHaveLength(3);
    const names = buildingCards.map((c) => c.textContent);
    expect(names).toEqual(expect.arrayContaining(["2号楼", "4号楼", "6号楼"]));
  });

  it("点选 6/17 后切回「全部楼栋」→ 恢复 6 栋全量，排序规则依旧", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(clickDateButton("周三", "17"));
    await waitFor(() => {
      expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    });

    await user.click(screen.getByRole("button", { name: "全部楼栋" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("全部楼栋施工安排");
    });

    const cards = screen.getAllByRole("heading", { level: 3 });
    expect(cards).toHaveLength(6);
    expect(["1号楼", "2号楼", "3号楼"]).toContain(cards[0].textContent);
  });

  it("点选不同日期自动跳转周视图：选 6/21 → 周日21被选中", async () => {
    const user = userEvent.setup();
    renderApp();

    const day21 = clickDateButton("周日", "21");
    await user.click(day21);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("2026-06-21");
    });

    expect(day21.className).toContain("bg-primary-500");
  });
});
