import Elysia, { t } from "elysia";
import { teamModule } from "@meetzeen/api/src/modules/team/team.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const teamRoutes = new Elysia({
  name: "teamRoutes",
  prefix: "/team",
})
  .use(betterAuthPlugin)
  .use(teamModule)
  .get(
    "/",
    ({ teamService, query }) => {
      return teamService.getTeam(query.organizationId);
    },
    {
      auth: true,
      query: t.Object({
        organizationId: t.String(),
      }),
    }
  )
  .get(
    "/calendar",
    ({ teamService, query }) => {
      return teamService.getCalendar(
        query.memberId,
        query.organizationId,
        query.startDate,
        query.endDate,
        query.timezone
      );
    },
    {
      auth: true,
      query: t.Object({
        memberId: t.String(),
        organizationId: t.String(),
        startDate: t.String(),
        endDate: t.String(),
        timezone: t.Optional(t.String()),
      }),
    }
  )
  .post(
    "/createTemplate",
    ({ teamService, body }) => {
      return teamService.createTemplate(
        body.memberId,
        body.organizationId,
        body.timeBlocks
      );
    },
    {
      auth: true,
      body: t.Object({
        memberId: t.String(),
        organizationId: t.String(),
        timeBlocks: t.Array(
          t.Object({
            dayOfWeek: t.Number(),
            startTime: t.String(),
            endTime: t.String(),
          })
        ),
      }),
    }
  )
  .put(
    "/template",
    ({ teamService, body }) => {
      return teamService.updateWeeklyTemplate(
        body.memberId,
        body.organizationId,
        body.dayOfWeek,
        body.timeBlocks
      );
    },
    {
      auth: true,
      body: t.Object({
        memberId: t.String(),
        organizationId: t.String(),
        dayOfWeek: t.Number(), // 0-6
        timeBlocks: t.Array(
          t.Object({
            startTime: t.String(), // "09:00"
            endTime: t.String(), // "17:00"
          })
        ),
      }),
    }
  )
  .put(
    "/day",
    ({ teamService, body }) => {
      return teamService.setDayAvailability(
        body.memberId,
        body.organizationId,
        body.date,
        body.timeBlocks,
        body.reason
      );
    },
    {
      auth: true,
      body: t.Object({
        memberId: t.String(),
        organizationId: t.String(),
        date: t.String(), // "2024-12-24"
        timeBlocks: t.Array(
          t.Object({
            startTime: t.String(),
            endTime: t.String(),
          })
        ),
        reason: t.Optional(t.String()),
      }),
    }
  )
  // Ruta unificada para actualizar horarios
  // Soporta: solo-este-dia, repetir, vacaciones, para-siempre
  .put(
    "/updateSchedule",
    ({ teamService, body }) => {
      return teamService.updateSchedule(
        body.memberId,
        body.organizationId,
        body.action,
        body.date,
        body.timeBlocks,
        body.repeatCount,
        body.reason
      );
    },
    {
      auth: true,
      body: t.Object({
        memberId: t.String(),
        organizationId: t.String(),
        action: t.Union([
          t.Literal("solo-este-dia"),
          t.Literal("repetir"),
          t.Literal("vacaciones"),
          t.Literal("para-siempre"),
        ]),
        date: t.String(), // "2025-01-15"
        timeBlocks: t.Array(
          t.Object({
            startTime: t.String(),
            endTime: t.String(),
          })
        ),
        repeatCount: t.Optional(t.Number()), // Solo para "repetir" (2-8)
        reason: t.Optional(t.String()),
      }),
    }
  )
  // Marcar días como no laborables
  // Ejemplo: Vacaciones de 20 al 30 de Diciembre
  .put(
    "/daysOff",
    ({ teamService, body }) => {
      return teamService.setDaysOff(
        body.memberId,
        body.organizationId,
        body.startDate,
        body.endDate,
        body.reason
      );
    },
    {
      auth: true,
      body: t.Object({
        memberId: t.String(),
        organizationId: t.String(),
        startDate: t.String(),
        endDate: t.String(),
        reason: t.Optional(t.String()),
      }),
    }
  )
  // Aplicar nuevo horario a multiples fechas especificas
  // Ejemplo: Estos 4 lunes: 2025-12-09, 2025-12-16, 2025-12-23, 2025-12-30
  .put(
    "/multipleDays",
    ({ teamService, body }) => {
      return teamService.setMultipleDaysAvailability(
        body.memberId,
        body.organizationId,
        body.dates,
        body.timeBlocks,
        body.reason
      );
    },
    {
      auth: true,
      body: t.Object({
        memberId: t.String(),
        organizationId: t.String(),
        dates: t.Array(t.String()),
        timeBlocks: t.Array(
          t.Object({
            startTime: t.String(),
            endTime: t.String(),
          })
        ),
        reason: t.Optional(t.String()),
      }),
    }
  )
  // Repetir horario cada semana por X semanas
  // Ejemplo: Desde 2025-01-15, repetir 4 veces (cada miércoles)
  .put(
    "/repeatSchedule",
    ({ teamService, body }) => {
      return teamService.setRepeatSchedule(
        body.memberId,
        body.organizationId,
        body.startDate,
        body.repeatCount,
        body.timeBlocks,
        body.reason
      );
    },
    {
      auth: true,
      body: t.Object({
        memberId: t.String(),
        organizationId: t.String(),
        startDate: t.String(), // "2025-01-15"
        repeatCount: t.Number(), // 2-8
        timeBlocks: t.Array(
          t.Object({
            startTime: t.String(),
            endTime: t.String(),
          })
        ),
        reason: t.Optional(t.String()),
      }),
    }
  )
  // Eliminar excepciones (Volver al template semanal)
  .delete(
    "/exception/:date",
    ({ teamService, params, query }) => {
      return teamService.removeDayException(
        query.memberId,
        query.organizationId,
        params.date
      );
    },
    {
      auth: true,
      params: t.Object({
        date: t.String(),
      }),
      query: t.Object({
        memberId: t.String(),
        organizationId: t.String(),
      }),
    }
  )
  // Eliminar horario completamente (template semanal y excepciones)
  .delete(
    "/removeSchedule",
    ({ teamService, query }) => {
      return teamService.removeSchedule(
        query.memberId,
        query.organizationId,
        query.date
      );
    },
    {
      auth: true,
      query: t.Object({
        memberId: t.String(),
        organizationId: t.String(),
        date: t.String(),
      }),
    }
  );
