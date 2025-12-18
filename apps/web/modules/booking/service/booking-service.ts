import { apiClient } from "@/lib/api/client";

export interface CustomerData {
  name: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export class BookingService {
  async createBooking(
    organizationId: string,
    memberId: string,
    services: string[],
    date: string,
    startTime: string,
    customer: CustomerData
  ) {
    const response = await apiClient.booking.post({
      organizationId,
      memberId,
      services,
      date,
      startTime,
      customer,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }
}

export const bookingService = new BookingService();