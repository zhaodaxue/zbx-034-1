import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import { useCalendarStore } from "@/store/useCalendarStore";
import { useReadStore } from "@/store/useReadStore";

export function resetStores() {
  window.localStorage.clear();
  const cs = useCalendarStore.getState();
  cs.setSelectedDate("2026-06-12");
  cs.setViewMode("all");
  cs.resetToToday();
  useReadStore.setState({ statusMap: {} });
}

export function renderApp() {
  resetStores();
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
}

export function renderUI(ui: React.ReactElement) {
  resetStores();
  render(<BrowserRouter>{ui}</BrowserRouter>);
}

export function findBuildingCardByName(name: string): HTMLElement | null {
  const headings = screen.getAllByRole("heading", { level: 3 });
  for (const h of headings) {
    if (h.textContent === name) {
      let el: HTMLElement | null = h as HTMLElement;
      while (el && !el.className?.toString().includes("cursor-pointer")) {
        el = el.parentElement;
      }
      return el;
    }
  }
  return null;
}

export function getHeaderStatValue(label: string): string {
  const allCards = document.querySelectorAll('div[class*="bg-gray-50/80"]');
  for (const card of Array.from(allCards)) {
    if (card.textContent?.includes(label)) {
      const valueEl = card.querySelector('span[class*="text-2xl"]');
      return valueEl?.textContent?.trim() || "";
    }
  }
  return "";
}

export function getListBadges() {
  const header = screen.getByRole("heading", { level: 2 });
  const container = header.parentElement!;
  const badges = container.querySelectorAll('span[class*="rounded-full"]');
  let today: string | null = null;
  let weekend: string | null = null;
  let total: string | null = null;
  badges.forEach((b) => {
    const t = b.textContent || "";
    if (t.includes("今日")) today = t;
    else if (t.includes("涉周末")) weekend = t;
    else if (/栋$/.test(t)) total = t;
  });
  return { today, weekend, total };
}

export function clickDateButton(dayName: string, dayNum: number | string) {
  const buttons = screen.getAllByRole("button").filter((b) => {
    const spans = b.querySelectorAll("span");
    if (spans.length < 2) return false;
    const w = spans[0].textContent?.trim();
    const d = spans[1].textContent?.trim();
    return w === dayName && d === String(dayNum);
  });
  return buttons[0];
}
