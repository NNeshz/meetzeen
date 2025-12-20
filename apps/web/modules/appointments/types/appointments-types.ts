export interface RawAppointment {
  id: string;
  customerName: string;
  appointmentDate: string; // "Date:YYYY-MM-DD"
  startTime: string; // "HH:MM" or "HH:MM:SS"
  endTime: string; // "HH:MM" or "HH:MM:SS"
}

export interface Appointment {
  id: string;
  start: string; // ISO string
  end: string;   // ISO string
  clientId?: string;
  clientName?: string;
  color?: string; // For UI
  isPast?: boolean;
}

export interface GroupedAppointments {
  date: string;
  appointments: RawAppointment[];
}
