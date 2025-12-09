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
      return teamService.getMemberCalendar(query.userId, query.organizationId);
    },
    {
      auth: true,
      query: t.Object({
        userId: t.String(),
        organizationId: t.String(),
      }),
    }
  )
  .put(
    "/calendar",
    ({ teamService, body }) => {
      return teamService.updateMemberCalendar(
        body.userId,
        body.organizationId,
        body.schedules
      );
    },
    {
      auth: true,
      body: t.Object({
        userId: t.String(),
        organizationId: t.String(),
        schedules: t.Array(
          t.Object({
            dayOfWeek: t.Number(), // 0=Sunday, 1=Monday, ..., 6=Saturday
            startTime: t.String(), // Format: "HH:mm"
            endTime: t.String(), // Format: "HH:mm"
          })
        ),
      }),
    }
  )