export type ConstructionType = "外立面" | "管道" | "电梯";

export interface Building {
  id: string;
  name: string;
  constructionType: ConstructionType;
  constructionDates: string[];
  timeSlotStart: string;
  timeSlotEnd: string;
  involvesWeekend: boolean;
  contactName: string;
  contactPhone: string;
  description: string;
}

export interface ReadStatus {
  buildingId: string;
  isRead: boolean;
  readAt: number;
}
