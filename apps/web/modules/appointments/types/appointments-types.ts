export interface RawAppointment {
  id: string;
  customerName: string;
  appointmentDate: string; // "Date:YYYY-MM-DD"
  startTime: string; 
  endTime: string; 
  status: string;
}

export interface Appointment {
  id: string;
  start: string; 
  end: string;   
  clientId?: string;
  clientName?: string;
  color?: string; 
  isPast?: boolean;
}

export interface GroupedAppointments {
  date: string;
  appointments: RawAppointment[];
}
