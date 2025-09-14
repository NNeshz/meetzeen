import Elysia, { t } from "elysia";
import { appointmentsModule } from "@meetzeen/api/src/modules/appointments/appointments.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

const serviceSchema = t.Object({
  id: t.String(),
  categoryId: t.String(),
  duration: t.String(),
  name: t.Optional(t.String()),
});

const availabilityRequestSchema = t.Object({
  serviciosSolicitados: t.Array(serviceSchema, { minItems: 1 }),
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
      return await appointmentsService.calcularDisponibilidad(body.serviciosSolicitados, params.organizationId);
    },
    {
      body: availabilityRequestSchema,
      params: t.Object({
        organizationId: t.String(),
      }),
    }
  );