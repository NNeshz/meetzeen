export interface Team {
  id: string;
  image: string | null;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface BaseSchedule {
  id: string;
  memberId: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMemberCalendar {
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
}
