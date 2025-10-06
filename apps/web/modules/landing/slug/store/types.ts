export interface Employee {
  id: string;
  name: string;
  imageUrl: string | null;
  categories: {
    id: string;
    name: string;
  }[];
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  category: {
    id: string;
    name: string;
  };
}

export interface ServiceWithEmployee {
  service: Service;
  selectedEmployees: Employee[];
  availableEmployees: Employee[];
}

// Interfaces para la respuesta de disponibilidad
export interface DateAvailability {
  day: Date;
  hours: string[];
}

export interface IndividualAvailability {
  employeeId: string;
  serviceId: string;
  datesAvailable: DateAvailability[];
}

export interface ServiceSlot {
  serviceId: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  order: number;
}

export interface SetAvailability {
  day: Date;
  startHour: string;
  endHour: string;
  services?: ServiceSlot[];
}

export interface AvailabilityResponse {
  set?: SetAvailability;
  individuals: IndividualAvailability[];
}

export interface ServiceSelection {
  serviceId: string;
  employeeId: string;
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedDateTime: Date | null;
  order?: number;
}

export interface CustomerData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface AppointmentData {
  organizationId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: Date; // fecha y hora de inicio de la cita completa
  duration: number; // duración total en minutos
  status: 'pending' | 'confirmed' | 'cancelled';
  slots: AppointmentSlotData[];
}

export interface AppointmentSlotData {
  employeeId: string;
  serviceId: string;
  startTime: Date; // hora exacta de inicio UTC
  endTime: Date; // hora exacta de fin UTC
}

// Tipos para preparar datos para el backend
export interface BookingPayload {
  appointment: {
    organizationId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string; // ISO string
    duration: number;
    status: 'pending';
  };
  slots: {
    employeeId: string;
    serviceId: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
  }[];
}