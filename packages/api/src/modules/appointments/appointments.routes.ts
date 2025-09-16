import Elysia, { t } from "elysia";
import { appointmentsModule } from "@meetzeen/api/src/modules/appointments/appointments.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

const serviceEmployeeSchema = t.Object({
  serviceId: t.String(),
  employeeId: t.String(),
});

const newAvailabilityRequestSchema = t.Object({
  services: t.Array(serviceEmployeeSchema, { minItems: 1 }),
});

export const appointmentsRoute = new Elysia({
  name: "appointmentRoute",
  prefix: "/appointments",
})
  .use(betterAuthPlugin)
  .use(appointmentsModule)
  .post(
    "/checkAvailability/:organizationId",
    async ({ appointmentsService, body, params }) => {
      return await appointmentsService.calcularDisponibilidad(body.services, params.organizationId);
    },
    {
      body: newAvailabilityRequestSchema,
      params: t.Object({
        organizationId: t.String(),
      }),
    }
  );