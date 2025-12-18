import Elysia from "elysia";
import { BookingService } from "@meetzeen/api/src/modules/booking/booking.service";
import { CustomerService } from "@meetzeen/api/src/modules/customers/customer.service";

export const bookingModule = new Elysia({
  name: "bookingModule",
}).decorate("bookingService", new BookingService(new CustomerService()));