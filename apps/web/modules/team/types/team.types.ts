export interface Team {
  id: string;
  image: string | null;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface DayInfo {
  id: string;
  memberId: string;
  date: string;
  timeBlocks: Array<{ startTime: string; endTime: string }>;
  isWorkingDay: boolean;
  source: string;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyTemplate {
  id: string;
  dayOfWeek: number;
  timeBlocks: TimeBlock[];
}

export interface CalendarData {
  days: DayInfo[];
  template: WeeklyTemplate[];
}

export interface TimeBlock {
  startTime: string;
  endTime: string;
}

export interface CreateTimeBlocks {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateWeeklyTemplateParams {
  memberId: string;
  dayOfWeek: number;
  timeBlocks: TimeBlock[];
}

export interface CreateTemplateParams {
  memberId: string;
  timeBlocks: CreateTimeBlocks[];
}

export interface SetDayAvailabilityParams {
  memberId: string;
  date: string;
  timeBlocks: TimeBlock[];
  reason?: string;
}

export interface SetDaysOffParams {
  memberId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface SetMultipleDaysAvailabilityParams {
  memberId: string;
  dates: string[];
  timeBlocks: TimeBlock[];
  reason?: string;
}

export interface RemoveDayExceptionParams {
  memberId: string;
  date: string;
}

export interface UpdateScheduleParams {
  memberId: string;
  action: "solo-este-dia" | "repetir" | "vacaciones" | "para-siempre";
  date: string;
  timeBlocks: TimeBlock[];
  repeatCount?: number;
  reason?: string;
}

export interface RemoveScheduleParams {
  memberId: string;
  date: string;
}