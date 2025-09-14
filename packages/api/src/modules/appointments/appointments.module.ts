import Elysia from "elysia";
import { AppointmentsService } from "@meetzeen/api/src/modules/appointments/appointments.service";

export const appointmentsModule = new Elysia({
  name: "appointmentsModule",
}).decorate("appointmentsService", new AppointmentsService());
