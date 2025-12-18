import { useQuery } from "@tanstack/react-query";
import { bookingService, type CustomerData } from "@/modules/booking/service/booking-service";

export const useAllBookings = (
  organizationId: string,
  memberId: string,
  date: string,
  startTime: string,
  services: string[],
  customer: CustomerData
) => {
  return useQuery({
    queryKey: ["bookings", organizationId],
    queryFn: () =>
      bookingService.createBooking(
        organizationId,
        memberId,
        services,
        date,
        startTime,
        customer
      ),
  });
};
