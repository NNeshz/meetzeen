import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/modules/booking/service/booking-service";

export const useAllBookings = (
  organizationId: string,
  memberId: string,
  date: string,
  startTime: string,
  services: string[]
) => {
  return useQuery({
    queryKey: ["bookings", organizationId],
    queryFn: () =>
      bookingService.createBooking(
        organizationId,
        memberId,
        services,
        date,
        startTime
      ),
  });
};
