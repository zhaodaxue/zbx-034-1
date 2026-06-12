import { create } from "zustand";
import type { ReadStatus } from "@/types";

const STORAGE_KEY = "building-read-status";

function loadFromStorage(): Record<string, ReadStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function saveToStorage(data: Record<string, ReadStatus>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

interface ReadState {
  statusMap: Record<string, ReadStatus>;
  isRead: (buildingId: string) => boolean;
  markAsRead: (buildingId: string) => void;
  countRead: (buildingIds: string[]) => number;
  countUnread: (buildingIds: string[]) => number;
}

export const useReadStore = create<ReadState>((set, get) => ({
  statusMap: loadFromStorage(),

  isRead: (buildingId) => {
    return get().statusMap[buildingId]?.isRead ?? false;
  },

  markAsRead: (buildingId) => {
    const newStatus: ReadStatus = {
      buildingId,
      isRead: true,
      readAt: Date.now(),
    };
    const newMap = { ...get().statusMap, [buildingId]: newStatus };
    saveToStorage(newMap);
    set({ statusMap: newMap });
  },

  countRead: (buildingIds) => {
    const map = get().statusMap;
    return buildingIds.filter((id) => map[id]?.isRead).length;
  },

  countUnread: (buildingIds) => {
    const map = get().statusMap;
    return buildingIds.filter((id) => !map[id]?.isRead).length;
  },
}));
