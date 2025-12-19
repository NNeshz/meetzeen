import Elysia, { t } from "elysia";
import { appointmentsModule } from "@meetzeen/api/src/modules/appointments/appointments.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const appointmentsRoutes = new Elysia({
  name: "appointmentsRoutes",
  prefix: "/appointments",
})
  .use(betterAuthPlugin)
  .use(appointmentsModule)
  .get(
    "/history",
    ({ appointmentsService, query }) => {
      return appointmentsService.getAppointmentsHistory(
        query.organizationId,
        query.clientTimezone,
        query.clientCurrentTime,
        query.limit,
        query.offset
      );
    },
    {
      auth: true,
      query: t.Object({
        organizationId: t.String(),
        clientTimezone: t.String(), // Timezone del cliente (ej: "America/Mexico_City")
        clientCurrentTime: t.String(), // Hora actual del cliente en formato ISO string
        limit: t.Optional(t.Number()),
        offset: t.Optional(t.Number()),
      }),
    }
  );
