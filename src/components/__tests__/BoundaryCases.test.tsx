import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp, resetStores, clickDateButton } from "@/test/testUtils";

describe("边界用例：空态 + 今天按钮状态", () => {
  beforeEach(() => {
    resetStores();
  });

  it("选中 6/1（周一）→ 无任何施工楼栋 → 显示空态文案与图标", async () => {
    const user = userEvent.setup();
    renderApp();

    const day1 = clickDateButton("周一", "1");
    await user.click(day1);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("2026-06-01");
    });

    expect(screen.getByText(/当日暂无施工安排/)).toBeInTheDocument();
    expect(screen.getByText(/请选择其他日期查看/)).toBeInTheDocument();
  });

  it("选中 6/1 空态后，再点击 6/12 → 立即恢复至少 3 栋今日施工楼栋", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(clickDateButton("周一", "1"));
    await waitFor(() => {
      expect(screen.getByText(/当日暂无施工安排/)).toBeInTheDocument();
    });

    await user.click(clickDateButton("周五", "12"));
    await waitFor(() => {
      const cards = screen.getAllByRole("heading", { level: 3 });
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("初始状态（今日 + 全部视图）：「今天」按钮应禁用", () => {
    renderApp();
    const todayBtn = screen.getByRole("button", { name: /今天/ });
    expect(todayBtn).toBeDisabled();
  });

  it("切换到其他日期：「今天」按钮启用；点击「今天」→ 回到今日+全部+禁用", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(clickDateButton("周日", "21"));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /今天/ })).not.toBeDisabled();
    });

    const todayBtn = screen.getByRole("button", { name: /今天/ });
    await user.click(todayBtn);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("全部楼栋施工安排");
    });

    expect(screen.getByRole("button", { name: /今天/ })).toBeDisabled();
  });

  it("今日+仅当日视图：「今天」按钮应启用（非全部视图）", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: "仅当日" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /今天/ })).not.toBeDisabled();
    });

    await user.click(screen.getByRole("button", { name: /今天/ }));
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("全部楼栋施工安排");
    });
  });
});
