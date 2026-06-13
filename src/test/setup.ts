import "@testing-library/jest-dom";
import { vi } from "vitest";

const FIXED_DATE = new Date("2026-06-12T10:00:00.000Z");

vi.useFakeTimers({ toFake: ["Date"] });
vi.setSystemTime(FIXED_DATE);

class LocalStorageMock implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
  writable: true,
});

beforeEach(() => {
  window.localStorage.clear();
});

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {
    return undefined;
  };
}

export {};
