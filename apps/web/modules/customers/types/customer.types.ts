export interface Customer {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  totalAppointments: number;
  lastAppointmentDate: string | null;
  isActive: boolean;
}

export interface CustomersResponse {
  results: Customer[];
  meta: {
    totalCustomers: number;
    filteredCustomers: number;
    limit: number;
    offset: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
