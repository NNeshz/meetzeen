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