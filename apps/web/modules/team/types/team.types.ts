export interface Team {
  id: string;
  image: string | null;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface TimeBlock {
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
}

export interface BaseSchedule {
  id: string;
  memberId: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  timeBlocks: TimeBlock[]; // Array of time blocks for the day
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecurrencePattern {
  frequency: "weekly" | "biweekly" | "monthly";
  interval?: number;
  count?: number;
  until?: string; // Format: "YYYY-MM-DD"
  byDay?: number[]; // Array of day of week [0-6]
}

export interface ScheduleException {
  id: string;
  memberId: string;
  type: "day_off" | "custom_hours" | "holiday";
  startDate: string; // Format: "YYYY-MM-DD"
  endDate?: string | null; // Format: "YYYY-MM-DD"
  recurrence?: RecurrencePattern | null;
  timeBlocks?: TimeBlock[] | null; // Only for type="custom_hours"
  reason?: string | null;
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Campo usado cuando la excepción es expandida desde una recurrencia
  originalExceptionId?: string;
}

export interface MemberCalendarResponse {
  baseSchedules: BaseSchedule[];
  exceptions: ScheduleException[];
}

// Legacy types - kept for backward compatibility if needed
export interface UpdateMemberCalendar {
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
}

export interface UpdateMemberCalendarRequest {
  userId: string;
  organizationId: string;
  selectedDate: string; // ISO date string
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  repeatType: "once" | "repeat" | "default" | "remove";
  repeatCount?: number; // Only for "repeat" type, number of weeks (1-52)
  timeSlots?: Array<{
    startHour: number; // 0-23
    startMinute: number; // 0-59
    endHour: number; // 0-23
    endMinute: number; // 0-59
  }>;
}
