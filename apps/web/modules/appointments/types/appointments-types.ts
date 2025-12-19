export interface RawAppointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  memberName: string;
  memberEmail: string;
  memberId: string;
  appointmentDate: string; // "Date:YYYY-MM-DD"
  startTime: string; // "HH:MM" or "HH:MM:SS"
  endTime: string; // "HH:MM" or "HH:MM:SS"
  status: string;
  paymentStatus: string;
  amountPaid: string;
  notes: string | null;
  createdAt: string;
}

export interface Appointment {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
  employeeId: string;
  clientId?: string;
  clientName?: string;
  serviceName?: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";
  color?: string; // For UI
}

export interface GroupedAppointments {
  date: string;
  appointments: RawAppointment[];
}
