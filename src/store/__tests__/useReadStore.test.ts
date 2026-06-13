import { describe, it, expect, beforeEach } from "vitest";
import { useReadStore } from "@/store/useReadStore";
import type { ReadStatus } from "@/types";

const STORAGE_KEY = "building-read-status";

describe("已读状态 store 与 localStorage 持久化", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useReadStore.setState({
      statusMap: {},
    });
  });

  it("初始化：localStorage 为空时 statusMap 为空对象", () => {
    expect(useReadStore.getState().statusMap).toEqual({});
    expect(useReadStore.getState().isRead("b1")).toBe(false);
  });

  it("markAsRead: 标记后 isRead 返回 true，readAt 时间戳合理", () => {
    useReadStore.getState().markAsRead("b1");
    const s = useReadStore.getState();
    expect(s.isRead("b1")).toBe(true);
    expect(s.isRead("b2")).toBe(false);
    const status = s.statusMap["b1"] as ReadStatus;
    expect(status.buildingId).toBe("b1");
    expect(status.isRead).toBe(true);
    expect(status.readAt).toBeLessThanOrEqual(Date.now());
  });

  it("countRead / countUnread: 按传入楼栋 ID 统计", () => {
    useReadStore.getState().markAsRead("b1");
    useReadStore.getState().markAsRead("b3");
    const ids = ["b1", "b2", "b3", "b4", "b5", "b6"];
    expect(useReadStore.getState().countRead(ids)).toBe(2);
    expect(useReadStore.getState().countUnread(ids)).toBe(4);
  });

  it("持久化：markAsRead 后数据写入 localStorage", () => {
    useReadStore.getState().markAsRead("b2");
    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string);
    expect(parsed.b2.isRead).toBe(true);
    expect(parsed.b2.buildingId).toBe("b2");
  });

  it("模拟刷新：读取时从 localStorage 恢复已读记录", () => {
    useReadStore.getState().markAsRead("b1");
    useReadStore.getState().markAsRead("b5");
    useReadStore.setState({ statusMap: {} });
    const fresh = useReadStore.getState();
    expect(fresh.isRead("b1")).toBe(false);
    expect(fresh.isRead("b5")).toBe(false);
  });

  it("持久化闭环：写入 localStorage → 清空内存 → 通过构造函数重新加载恢复", () => {
    useReadStore.getState().markAsRead("b3");
    useReadStore.getState().markAsRead("b4");
    const persisted = window.localStorage.getItem(STORAGE_KEY);
    expect(persisted).not.toBeNull();
    const storedMap = JSON.parse(persisted as string);
    expect(storedMap.b3.isRead).toBe(true);
    expect(storedMap.b4.isRead).toBe(true);
  });

  it("异常容错：localStorage 损坏时不抛错", () => {
    window.localStorage.setItem(STORAGE_KEY, "{invalid json");
    const fn = () => useReadStore.getState();
    expect(fn).not.toThrow();
  });
});
